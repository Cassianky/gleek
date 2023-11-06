import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "./database/urbanOriginsDb.js";
import "./loadEnvironment.js";
import gleekRoutes from "./routes/gleek/gleek.js";
import activityRoutes from "./routes/gleekAdmin/activityRoute.js";
import gleekAdminRoutes from "./routes/gleekAdmin/gleekAdmin.js";
import gleekVendorRoutes from "./routes/gleekVendor/gleekVendor.js";
import vendorRoutes from "./routes/gleekAdmin/vendorRoute.js";
import surveyRoutes from "./routes/gleekAdmin/surveyRoute.js";
import reviewRoutes from "./routes/gleekAdmin/reviewRoute.js";
import bookingRoutes from "./routes/gleekAdmin/bookingRoute.js";
import client from "./routes/gleekAdmin/client.js";
import activityTestController from "./controller/activityTestController.js";
import notificationRoutes from "./routes/notificationRoute.js";
import chatroomRoutes from "./routes/chatroomRoute.js";
import chatMessageRoutes from "./routes/chatMessageRoute.js";
import pdf from "html-pdf";
import { InvoiceTemplate } from "./assets/templates/InvoiceTemplate.js";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();

const port = process.env.PORT;
const userFrontendUrl = process.env.USER_FRONTEND_URL;
const adminFrontendUrl = process.env.ADMIN_FRONTEND_URL;

// Custom middleware to apply different CORS options based on the origin
const customCors = (req, callback) => {
   const whitelist = [userFrontendUrl, adminFrontendUrl];
   const origin = req.header("Origin");

   if (whitelist.includes(origin)) {
      // Apply credentials: true for http://localhost:3001
      const corsOptions = {
         origin,
         credentials: true,
      };
      callback(null, corsOptions);
   } else {
      // Disallow CORS for other origins
      callback();
   }
};
app.use(cors(customCors));

app.use(cookieParser());

app.use(express.json());

app.use("/gleekAdmin", gleekAdminRoutes);
app.use("/vendor", vendorRoutes);
app.use("/activity", activityRoutes);
app.use("/client", client);
app.use("/booking", bookingRoutes);
app.use("/survey", surveyRoutes);
app.use("/review", reviewRoutes);

/**
 * For Client application
 */
app.use("/gleek", gleekRoutes);

/**
 * For Vendor application
 */
app.use("/gleekVendor", gleekVendorRoutes);
//for activity image upload test
app.use("/testActivity", activityTestController);
app.use("/notification", notificationRoutes);
app.use("/chatroom", chatroomRoutes);
app.use("/chatMessage", chatMessageRoutes);

app.get("/pdf", (req, res, next) => {
   const booking = {
      client: {
         name: "Yunus",
      },
      startDateTime: "2023-10-20T01:00:00.000+00:00",
      endDateTime: "2023-10-20T04:00:00.000+00:00",
      totalCost: 900,
      totalPax: 20,
      activityTitle: "Coffee Grounds",
      vendorName: "Sustainability Project",
      status: "PENDING_CONFIRMATION",
      billingAddress: "test",
      billingPostalCode: "1",
   };

   pdf.create(InvoiceTemplate(booking), {}).toStream(function (err, stream) {
      res.setHeader("Content-Type", "appplication/pdf");
      res.setHeader("Content-Disposition", "inline;filename=test.pdf");
      stream.pipe(res);
   });
});

const server = app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});

// const httpServer = createServer(app);

const io = new Server(server, {
   pingTimeout: 60000,
   cors: {
      origin: [userFrontendUrl, adminFrontendUrl],
   },
});

io.on("connection", (socket) => {
   console.log("Connected to socket.io");
   socket.on("setup", (userData) => {
      console.log("setup user data: ", userData);
      socket.join(userData);
      socket.emit("connected");
   });

   socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
   });

   socket.on("new message", (newMessageReceived) => {
      console.log("socket on new message received::", newMessageReceived);
      let uniqueId;
      if (newMessageReceived.senderRole === "CLIENT") {
         if (newMessageReceived.chatRoom.admin === false) {
            uniqueId = "VENDOR" + newMessageReceived.chatRoom.vendor;
         } else {
            uniqueId = "Admin";
         }
      } else if (newMessageReceived.senderRole === "VENDOR") {
         if (newMessageReceived.chatRoom.admin === false) {
            uniqueId = "CLIENT" + newMessageReceived.chatRoom.client;
         } else {
            uniqueId = "Admin";
         }
      } else {
         if (newMessageReceived.chatRoom.client === null) {
            uniqueId = "VENDOR" + newMessageReceived.chatRoom.vendor;
         } else {
            uniqueId = "CLIENT" + newMessageReceived.chatRoom.client;
         }
      }
      socket.to(uniqueId).emit("message received", newMessageReceived);
   });

   socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
   });
});
