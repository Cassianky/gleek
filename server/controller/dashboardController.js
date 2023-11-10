import AdminSurveyResponseModel from "../model/adminSurveyResponseModel.js";
import BookingModel from "../model/bookingModel.js";
import Review from "../model/reviewModel.js";
import ReviewSentimentModel from "../model/reviewSentimentModel.js";
import SurveySentimentModel from "../model/surveySentimentModel.js";
import { getAllVendorActivities } from "../service/activityService.js";
import { s3GetImages } from "../service/s3ImageServices.js";

export const getTotalRevenue = async (req, res) => {
  const vendorId = req.user;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  let previousMonth = currentMonth - 1;
  let previousYear = currentYear;
  const revenuesByMonth = [];
  let activityRevenue = {};
  let activityBookings = {};

  const result = await getActivitySentiment(vendorId);

  const thisMonthRev = await calculateRevenue(
    currentYear,
    currentMonth,
    vendorId,
  );
  const lastMonthRev = await calculateRevenue(
    previousYear,
    previousMonth,
    vendorId,
  );

  const revenueDiff = calculateDifference(
    thisMonthRev.revenue,
    lastMonthRev.revenue,
  );
  const bookingsDiff = calculateDifference(
    thisMonthRev.count,
    lastMonthRev.count,
  );

  for (let i = 0; i < 12; i++) {
    let year = currentYear;
    let month = i;

    if (month < 0) {
      month = 11;
      year = currentYear - 1;
    }
    try {
      const { revenue, count, activityByRevenue } = await calculateRevenue(
        year,
        month,
        vendorId,
      );
      for (let a of Object.keys(activityByRevenue)) {
        if (activityByRevenue[a].activityTitle in activityRevenue) {
          activityRevenue[activityByRevenue[a].activityTitle][i] +=
            activityByRevenue[a].totalRevenue;
        } else {
          activityRevenue[activityByRevenue[a].activityTitle] = new Array(
            12,
          ).fill(0);
          activityRevenue[activityByRevenue[a].activityTitle][i] =
            activityByRevenue[a].totalRevenue;
        }
        if (activityByRevenue[a].activityTitle in activityBookings) {
          activityBookings[activityByRevenue[a].activityTitle][i] +=
            activityByRevenue[a].totalBookings;
        } else {
          activityBookings[activityByRevenue[a].activityTitle] = new Array(
            12,
          ).fill(0);
          activityBookings[activityByRevenue[a].activityTitle][i] =
            activityByRevenue[a].totalBookings;
        }
      }
      revenuesByMonth.push({
        year,
        month,
        revenue,
        count,
        activityByRevenue,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server Error! Unable to retrieve dashboard.",
        error: error.message,
      });
    }
  }
  res.status(200).json({
    confirmedPendingPaidBookingsRevenue: {
      value: thisMonthRev.revenue,
      difference: revenueDiff,
    },
    revenuesByMonth: revenuesByMonth,
    numberOfBookings: { value: thisMonthRev.count, difference: bookingsDiff },
    activitySentiment: result,
    activityRevenue,
    activityBookings,
  });
};

export const calculateRevenue = async (currentYear, currentMonth, vendorId) => {
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  try {
    const confirmedPendingPaidBookings = await BookingModel.find({
      vendorId: vendorId,
      status: { $in: ["CONFIRMED", "PAID", "PENDING_PAYMENT"] },
      actionHistory: {
        $elemMatch: {
          newStatus: "CONFIRMED",
          actionTimestamp: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
    });
    let arr = [];
    for (const thing of confirmedPendingPaidBookings) {
      arr.push(thing.toObject());
    }
    const confirmedPendingPaidBookingsRevenue =
      confirmedPendingPaidBookings.reduce((total, booking) => {
        let amount;
        if (isNaN(booking.totalVendorAmount)) {
          amount = 0;
        } else {
          amount = booking.totalVendorAmount;
        }
        return total + amount;
      }, 0);

    const activityByRevenue = confirmedPendingPaidBookings.reduce(
      (acc, booking) => {
        const { activityId, totalVendorAmount, activityTitle } = booking;
        if (!acc[activityId]) {
          acc[activityId] = {
            totalBookings: 0,
            totalRevenue: 0,
            activityTitle,
          };
        }
        acc[activityId].totalBookings += 1;
        acc[activityId].totalRevenue += totalVendorAmount;
        return acc;
      },
      {},
    );

    return {
      count: confirmedPendingPaidBookings.length,
      revenue: confirmedPendingPaidBookingsRevenue,
      activityByRevenue,
    };
  } catch (error) {
    throw new Error(
      "Server Error! Unable to retrieve dashboard." + error.message,
    );
  }
};

export const getActivitySentiment = async (vendorId) => {
  try {
    const activities = await getAllVendorActivities(vendorId);
    let res = [];
    for (const activity of activities) {
      let activityId = activity._id;
      let preSignedUrlArr = await s3GetImages(activity.images);
      activity.preSignedImages = preSignedUrlArr;
      const surveySentiments = await SurveySentimentModel.find({
        activity: activityId,
      });

      const reviewSentiments = await ReviewSentimentModel.find({
        activity: activityId,
      })
        .populate("review")
        .then((sentiments) => {
          const filteredSentiments = sentiments.filter(
            (sentiment) => sentiment.review.hidden === false,
          );
          return filteredSentiments;
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
      const bookings = await BookingModel.find({
        activityId,
        status: { $in: ["CONFIRMED", "PAID", "PENDING_PAYMENT"] },
      });
      const bookingIds = bookings.map((booking) => booking._id);
      const surveys = await AdminSurveyResponseModel.find({
        booking: { $in: bookingIds },
      });
      const totalRecommendationScore = surveys.reduce(
        (total, s) => total + s.recommendationScore,
        0,
      );
      const avgRecommendationScore = totalRecommendationScore / surveys.length;

      const totalRepeatActivityDifferentVendorScore = surveys.reduce(
        (total, s) => total + s.repeatActivityDifferentVendorScore,
        0,
      );

      const avgRepeatActivityDifferentVendorScore =
        totalRepeatActivityDifferentVendorScore / surveys.length;

      const totalRepeatActivityScore = surveys.reduce(
        (total, s) => total + s.repeatActivityScore,
        0,
      );

      const avgTotalRepeatActivityScore =
        totalRepeatActivityScore / surveys.length;

      const totalSentiment = surveySentiments.reduce(
        (total, s) => total + s.overallSentiment,
        0,
      );

      const reviews = await Review.find({
        booking: { $in: bookingIds },
        hidden: false,
      });

      const totalRatingScore = reviews.reduce(
        (total, s) => total + s.rating,
        0,
      );
      const avgReviewRating = totalRatingScore / reviews.length;
      let activityLiked = [];
      let activityImprovement = [];
      surveySentiments.map((s) => {
        activityLiked = [...activityLiked, ...s.activityLikedKeyWords];
        activityImprovement = [
          ...activityImprovement,
          ...s.activityImprovementsKeyWords,
        ];
      });
      let totalReviewSentiments = [];
      reviewSentiments.map((s) => {
        totalReviewSentiments = [...totalReviewSentiments, ...s.keywords];
      });
      const reviewSentimentScore = reviewSentiments.reduce(
        (total, s) => total + s.overallSentiment,
        0,
      );
      res.push({
        activity: activity,
        activityLiked,
        activityImprovement,
        totalSentiment,
        numberOfBookings: bookings.length,
        numberOfSurveys: surveySentiments.length,
        numberOfReviews: reviews.length,
        avgRecommendationScore,
        avgRepeatActivityDifferentVendorScore,
        avgTotalRepeatActivityScore,
        avgReviewRating,
        totalReviewSentiments,
        reviewSentimentScore,
      });
    }
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const calculateDifference = (currentRev, pastRev) => {
  return pastRev !== 0 ? ((currentRev - pastRev) * 100) / pastRev : 12;
};
