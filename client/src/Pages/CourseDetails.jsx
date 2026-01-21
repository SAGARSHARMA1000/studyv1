import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ConfirmationModal from "../Component/Common/ConfirmationModal"
import Footer from "../Component/Common/Footer"
import RatingStars from "../Component/Common/RatingStars"
import CourseAccordionBar from "../Component/Core/Course/CourseAccordionBar"
import CourseDetailsCard from "../Component/Core/Course/CourseDetailsCard"
import { formatDate } from "../Service/formatDate"
import { fetchCourseDetails } from "../Service/Operation/courseDetailsAPI"
import { BuyCourse } from "../Service/Operation/studentFeaturesAPI"
import GetAvgRating from "../Util/avgRating"
import Error from "./Error"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const { courseId } = useParams()



  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {

    ; (async () => {
      try {
        const res = await fetchCourseDetails(courseId)

        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])




  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])




  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {

    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }


  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnroled,
    createdAt,
  } = response.data?.courseDetails

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {

    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
     {/* ================= HERO + COURSE CARD ================= */}
<div className="w-full bg-richblack-800">
  <div className="mx-auto max-w-maxContentTab px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* ================= LEFT CONTENT ================= */}
    <div className="lg:col-span-2 flex flex-col gap-6">

      {/* Mobile Thumbnail */}
      <div className="relative block max-h-120 lg:hidden">
        <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]" />
        <img
          src={thumbnail}
          alt="course thumbnail"
          className="w-full"
        />
      </div>

      {/* Course Info */}
      <div className="flex flex-col gap-4 text-richblack-5">
        <p className="text-4xl font-bold sm:text-[42px] tracking-wider text-center lg:text-left">
          {courseName}
        </p>

        {/* ✅ FIXED: no <p> wrapping <ul> */}
        <div className="text-richblack-200">
          <ul className="space-y-2">
            {courseDescription.split("\n").map((line, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>{index + 1}.</span>
                <span>{line.trim().substring(line.indexOf(".") + 1).trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ratings */}
        <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
          <span className="text-yellow-25">{avgReviewCount}</span>
          <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
          <span>({ratingAndReviews.length} reviews)</span>
          <span>{studentsEnroled.length} students enrolled</span>
        </div>

        {/* Instructor */}
        <p>
          Created By {`${instructor.firstName} ${instructor.lastName}`}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-5 text-lg">
          <p className="flex items-center gap-2">
            <BiInfoCircle /> Created at {formatDate(createdAt)}
          </p>
          <p className="flex items-center gap-2">
            <HiOutlineGlobeAlt /> English
          </p>
        </div>
      </div>

      {/* Mobile Price Box */}
      <div className="flex flex-col gap-4 border-y border-richblack-500 py-4 lg:hidden">
        <p className="text-3xl font-semibold">Rs. {price}</p>
        <button
          className="yellowButton uppercase tracking-wider"
          onClick={handleBuyCourse}
        >
          Buy Now
        </button>
        <button className="blackButton uppercase tracking-wider">
          Add to Cart
        </button>
      </div>
    </div>

    {/* ================= RIGHT COURSE CARD ================= */}
    <div className="hidden lg:block sticky top-24 h-fit">
      <CourseDetailsCard
        course={response?.data?.courseDetails}
        setConfirmationModal={setConfirmationModal}
        handleBuyCourse={handleBuyCourse}
      />
    </div>
  </div>
</div>

{/* ================= LOWER CONTENT ================= */}
<div className="mx-auto max-w-maxContentTab px-4 text-richblack-5">

  {/* What You'll Learn */}
  <div className="my-8 border border-richblack-600 p-8">
    <p className="text-3xl font-semibold uppercase tracking-wider">
      What you'll Learn?
    </p>

    <div className="mt-5">
      <ul className="space-y-2 leading-relaxed">
        {whatYouWillLearn.split("\n").map((line, index) => (
          <li key={index} className="flex items-start gap-2">
            <span>{index + 1}.</span>
            <span>{line.trim().substring(line.indexOf(".") + 1).trim()}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Course Content */}
  <div className="max-w-207.5">
    <div className="flex flex-col gap-3">
      <p className="text-[28px] font-semibold uppercase tracking-wider">
        Course Content
      </p>

      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <span>{courseContent.length} section(s)</span>
          <span>{totalNoOfLectures} lecture(s)</span>
          <span>{response.data?.totalDuration}</span>
        </div>

        <button
          className="text-yellow-25"
          onClick={() => setIsActive([])}
        >
          Collapse all sections
        </button>
      </div>
    </div>

    {/* Accordion */}
    <div className="py-4">
      {courseContent.map((course, index) => (
        <CourseAccordionBar
          key={index}
          course={course}
          isActive={isActive}
          handleActive={handleActive}
        />
      ))}
    </div>

    {/* Author */}
    <div className="mb-12 py-4">
      <p className="text-[28px] font-semibold">Author</p>

      <div className="flex items-center gap-4 py-4">
        <img
          src={
            instructor.image
              ? instructor.image
              : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
          }
          alt="Author"
          className="h-14 w-14 rounded-full object-cover"
        />
        <p className="text-lg">
          {instructor.firstName} {instructor.lastName}
        </p>
      </div>

      <p className="text-richblack-50">
        {instructor?.additionalDetails?.about}
      </p>
    </div>
  </div>
</div>

      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
