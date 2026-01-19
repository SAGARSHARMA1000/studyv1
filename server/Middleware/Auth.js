
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Model/User");

dotenv.config();


// exports.auth = async (req, res, next) => {
// 	try {
		
// 		const token =
// 			req.cookies.token ||
// 			req.body.token ||
// 			req.header("Authorization").replace("Bearer ", "");

		
// 		if (!token) {
// 			return res.status(401).json({ success: false, message: `Token Missing` });
// 		}

// 		try {
			
// 			const decode = await jwt.verify(token, process.env.JWT_SECRET);
// 			console.log(decode);
			
// 			req.user = decode;
// 		} catch (error) {
			
// 			return res
// 				.status(401)
// 				.json({ success: false, message: "token is invalid" });
// 		}

		
// 		next();
// 	} catch (error) {
		
// 		return res.status(401).json({
// 			success: false,
// 			message: `Something Went Wrong While Validating the Token`,
// 		});
// 	}
// };
// exports.isStudent = async (req, res, next) => {
// 	try {
// 		const userDetails = await User.findOne({ email: req.user.email });

// 		if (userDetails.accountType !== "Student") {
// 			return res.status(401).json({
// 				success: false,
// 				message: "This is a Protected Route for Students",
// 			});
// 		}
// 		next();
// 	} catch (error) {
// 		return res
// 			.status(500)
// 			.json({ success: false, message: `User Role Can't be Verified` });
// 	}
// };
// exports.isAdmin = async (req, res, next) => {
// 	try {
// 		const userDetails = await User.findOne({ email: req.user.email });

// 		if (userDetails.accountType !== "Admin") {
// 			return res.status(401).json({
// 				success: false,
// 				message: "This is a Protected Route for Admin",
// 			});
// 		}
// 		next();
// 	} catch (error) {
// 		return res
// 			.status(500)
// 			.json({ success: false, message: `User Role Can't be Verified` });
// 	}
// };
// exports.isInstructor = async (req, res, next) => {
// 	try {
// 		const userDetails = await User.findOne({ email: req.user.email });
// 		console.log(userDetails);

// 		console.log(userDetails.accountType);

// 		if (userDetails.accountType !== "Instructor") {
// 			return res.status(401).json({
// 				success: false,
// 				message: "This is a Protected Route for Instructor",
// 			});
// 		}
// 		next();
// 	} catch (error) {
// 		return res
// 			.status(500)
// 			.json({ success: false, message: `User Role Can't be Verified` });
// 	}
// };


exports.auth = (req, res, next) => {
  try {
	 console.log("AUTH HEADER:", req.header("Authorization"));
     console.log("COOKIE TOKEN:", req.cookies?.token);

    // ✅ Get token safely from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
exports.isStudent = (req, res, next) => {
  if (req.user.accountType !== "Student") {
    return res.status(403).json({
      success: false,
      message: "This route is only for Students",
    });
  }
  next();
};
exports.isInstructor = (req, res, next) => {
  if (req.user.accountType !== "Instructor") {
    return res.status(403).json({
      success: false,
      message: "This route is only for Instructors",
    });
  }
  next();
};
exports.isAdmin = (req, res, next) => {
  if (req.user.accountType !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "This route is only for Admins",
    });
  }
  next();
};
