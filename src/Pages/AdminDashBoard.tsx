import Navbar from "../Components/Navbar"
import { AdminLayout } from "../DashBoards/dashboardDesign/AdminLayout"

export const AdminDashBoard = () => {
  return (
    <div className="h-screen mt-20">
      <Navbar/>
      <AdminLayout/>        
    </div>
  )
}