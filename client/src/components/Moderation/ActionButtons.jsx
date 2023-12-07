import React from 'react';
import './ActionButtons.less';
import { updateGloballyHidden, updateReportStatus } from "../../Utils/requests";
import { Button } from 'antd';

export default function ActionButtons({reportID, display = 0}) {

  function Approve() {
    // This function marks the content as "approved", meaning the moderator has deemed it appropriate
    // Alert the moderator
    alert("The content has been approved! Report ID: " + reportID);
    
    // Use setter from requests.js to update status column as approved
    updateReportStatus(reportID, "approved")

    // Remove hidden status from gallery, if hidden
    updateGloballyHidden(reportID, 0);
  }

  function Reject() {
    // This function marks the content as "rejected", meaning the moderator has deemed it inappropriate
    // Alert the moderator
    alert("The content has been rejected! Report ID: " + reportID);

    // Use setter from requests.js to update status column as rejected
    updateReportStatus(reportID, "rejected")

    // Enabling hiding post from gallery if not already hidden
    updateGloballyHidden(reportID, 1);
  }

  // The code below allows for the developer to decide which buttons are displayed in a given
  // implementation. 0 for both buttons, 1 for approve, and 2 for reject. 0 is default.
  if (display == 0) {
    return (
      <span className="ActionButtons">
          <Button className={'approve'} onClick={ Approve }>Approve</Button>
          <Button className={'reject'} onClick={ Reject }>Reject</Button>
      </span>
    );
  }
  if (display == 1) {
    return (
      <span className="ActionButtons">
          <Button className={'approve'} onClick={ Approve }>Approve</Button>
      </span>
    );
  }
  if (display == 2) {
    return (
      <span className="ActionButtons">
          <Button className={'reject'} onClick={ Reject }>Reject</Button>
      </span>
    );
  } else {
    return (
      <span className="ActionButtons">
          <Button className={'approve'} onClick={ Approve }>Approve</Button>
          <Button className={'reject'} onClick={ Reject }>Reject</Button>
      </span>
    );
  }
}
