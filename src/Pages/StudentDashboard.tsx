import Navbar from "../Components/Navbar"
import { StudentLayout } from "../DashBoards/dashboardDesign/StudentDashboard/StudentLayout"

export const StudentDashBoard = () => {
  return (
    <div className="h-screen mt-20">
      <Navbar/>
      <StudentLayout/>        
    </div>
  )
}