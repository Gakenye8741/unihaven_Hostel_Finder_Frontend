import Navbar from "../Components/Navbar"
import { OwnerLayout } from "../DashBoards/dashboardDesign/OwnerDesign Dashboard/OwnerLayout"

export const OwnerDashBoard = () => {
  return (
    <div className="h-screen mt-20">
      <Navbar/>
      <OwnerLayout/>        
    </div>
  )
}