import { header } from "./header.js";
import { footer } from "./footer.js";

export const BookingSummaryVendor = (booking) => {
   const getFormattedDate = (dateTime) => {
      dateTime = new Date(dateTime);

      return dateTime.toLocaleDateString(undefined, {
         day: "2-digit",
         month: "short",
         year: "numeric",
      });
   };

   const getFormattedTime = (dateTime) => {
      dateTime = new Date(dateTime);
      return dateTime.toLocaleTimeString(undefined, {
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
   };
   return ` 
   <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
   <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <br />
      <style type="text/css">
         	p {margin: 0; padding: 0;}	.ft10{font-size:10px;font-family:Arial;color:#5C4B99;}
         	.ft11{font-size:13px;font-family:Arial;color:#5C4B99;}
         	.ft12{font-size:11px;font-family:Arial;color:#5C4B99;}
         	.ft13{font-size:11px;font-family:Arial;color:#5C4B99;}
         	.ft14{font-size:13px;font-family:Arial;color:#5C4B99;}
             .ft145{font-size:15px;font-family:Arial;color:#5C4B99;}
         	.ft15{font-size:22px;font-family:Arial;color:#9F91CC;}
         	.ft16{font-size:30px;font-family:Arial;color:#5C4B99;}
         	.ft17{font-size:20px;font-family:Arial;color:#5C4B99;}
         	.ft18{font-size:10px;font-family:Arial;color:#9F91CC;}
         	.ft19{font-size:13px;font-family:Arial;color:#9F91CC;}
         	.ft110{font-size:13px;font-family:Arial;color:#9F91CC;}
         	.ft111{font-size:11px;line-height:21px;font-family:Arial;color:#5C4B99;}
         	.ft112{font-size:11px;line-height:21px;font-family:Arial;color:#3D246C;}
         	.ft113{font-size:13px;line-height:23px;font-family:Arial;color:#9F91CC;}
      </style>
   </head>
   <body bgcolor="#fff" vlink="blue" link="blue" style="size: A4; padding: 5%">
      ${header("Booking Summary")}
      <hr style="color: #FFDBC3; height: 2.5px; background-color: #5C4B99"/>
      <div>
         <div
            style="
               position: relative;
               display: flex;
               flex-direction: row;
               justify-content: space-between;
            "
         >
               <div>
                  <span class="ft145"><b>Attn: ${
                     booking.vendorName
                  } </b> <br /><b>${booking.vendorId.companyEmail}</b><br />
                  ${booking.vendorId.companyAddress}<br />
                  Singapore, ${booking.vendorId.companyPostalCode}</span>
               <div>
               <div class="ft145"><p style="align:right;">${getFormattedDate(
                  Date.now()
               )}</p></div>
         </div>
         <hr
            style="color: #FFDBC3; height: 2.5px; background-color: #5C4B99"
         />
         <table style="width: 100%">
            <tr>
               <th class="ft145" style="width: 30%; text-align: left">
                  Description
               </th>
               <th class="ft145" style="width: 10%">Pax</th>
               <th class="ft145" style="width: 15%">Price/Pax</th>
               <th class="ft145" style="width: 15%">Add-Ons</th>
               <th class="ft145" style="width: 15%">Discount</th>
               <th class="ft145" style="width: 15%">Amount SGD</th>
            </tr>
         </table>
         <hr
            style="color: #FFDBC3; height: 2.5px; background-color: #5C4B99"
         />
         <table style="width: 100%">
            <tr>
               <th class="ft113" style="width: 30%; text-align: left">
                  <b>${booking.activityTitle}</b>
                  <ul style="padding-top: unset; line-height: 16px">
                    <li class="ft110">Date: ${getFormattedDate(
                       booking.startDateTime
                    )}</li>
                    <li class="ft110">Time: ${getFormattedTime(
                       booking.startDateTime
                    )} - ${getFormattedTime(booking.endDateTime)}</li>
                    <li class="ft110">Type: ${
                       booking.activityId.activityType
                    }</li>
                    <li>Theme: ${booking.activityId.theme.name}</li>
                    <li>Sub-Theme: ${booking.activityId.subtheme[0].name}</li>
                    <li>Booked By: ${booking.clientId.companyName}</li>
                  </ul>
               </th>
               <th class="ft113" style="width: 10%">${booking.totalPax}</th>
               <th class="ft113" style="width: 15%">$${Math.round(
                  booking.totalVendorAmount / booking.totalPax,
                  2
               )}</th>
               <th class="ft113" style="width: 15%; ">$${
                  booking.vendorWeekendAddOnCost +
                     booking.vendorOnlineAddOnCost +
                     booking.vendorOfflineAddOnCost >
                  0
                     ? booking.weekendAddOnCost +
                       booking.onlineAddOnCost +
                       booking.offlineAddOnCost
                     : 0
               }<th>
               <th class="ft113" style="width: 15%">$${
                  booking.vendorWeekendAddOnCost +
                     booking.vendorOnlineAddOnCost +
                     booking.vendorOfflineAddOnCost <
                  0
                     ? -(
                          booking.weekendAddOnCost +
                          booking.onlineAddOnCost +
                          booking.offlineAddOnCost
                       )
                     : 0
               }<th>
               <th class="ft113" style="width: 15%">$${
                  booking.totalVendorAmount
               }</th>
            </tr>
         </table>
            <hr style="color: #FFDBC3; height: 2.5px; background-color: #5C4B99"/>
            <div
               style="
                  display: flex;
                  flex-direction: row;
                  width: 50%;
                  padding-left: 75%;
                  justify-content: space-between;
               "
            >
               <p class="ft15" style="color: #000;">
                  <b>Total price: $${booking.totalVendorAmount}</b>
               </p>
            </div>
         </div>
      </div>
      ${footer}
   </body>
</html>  
`;
};
