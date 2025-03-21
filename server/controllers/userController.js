import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

// get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};

// user enrolled courses
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");
    return res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) return res.json({ success: false, message: "Data not found" });

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (courseData.coursPrice - courseData.discount * courseData.coursPrice / 100).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // stripe gateway initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // creating line items for stripe
    const line_items = [{
      price_data: {
        currency,
        product_data: {
          name: courseData.courseTitle,
        },
        unit_amount: Math.floor(newPurchase.amount) * 100
      },
      quantity: 1
    }];

    console.log("🚀 ~ userController.js:66 ~ purchaseCourse ~ line_items:", line_items);



    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString()
      }
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};