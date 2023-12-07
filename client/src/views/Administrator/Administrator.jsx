import React from "react"
import NavBar from "../../components/NavBar/NavBar"
import ActionButtons from "../../components/Moderation/ActionButtons"
import Resolved from "../../components/Moderation/Resolved"
import "./Administrator.less"
import { useGlobalState } from "../../Utils/userState"

// Output for test administrator Page. Actual implementation is on GalleryAdmin page.
export default function Administrator(props) {
  const [value] = useGlobalState("currUser") // Get current user
  // Check if user has appropriate role to view page. Should be changed to administrator/moderator role(s) when they are implemented.
  if (value.role === "ContentCreator") {
    return (
      <div className="container nav-padding">
        <NavBar />
        <Resolved/>
        <ActionButtons reportID={2} />
      </div>
    )
  } else {
    // If the user is not the appropriate role(s), return an unauthorized message.
    return (
      <p>Unauthorized.</p>
    )
  }

}
