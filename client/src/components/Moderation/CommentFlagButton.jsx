import React, { useState } from 'react';
import Less from './CommentFlagButton.less';
import {getReportFromGalleryID, getStudent} from '../../Utils/requests';
import { updateGloballyHidden } from '../../Utils/requests';
import {updateReporters} from '../../Utils/requests';
import {deleteReport} from '../../Utils/requests';
import {createReport} from '../../Utils/requests';
import {getReport} from '../../Utils/requests';
import {HiddenStatus} from './ModerationCheck.jsx';
import { Button } from 'antd';

export default function CommentFlagButton({galleryID}){

  let [status, setStatus] = useState("Unclicked");
  let [clicked, setClicked] = useState(false);


  function HandleClick() {
    if (!clicked) {
      Flag();
    } else if (clicked) {
      Unflag();
    }
  }
  
  function Flag() { //flag content
    alert("The content has been flagged! Unique key: " + galleryID);
    setStatus("Clicked");
    setClicked(true);
    getReportFromGalleryID(galleryID).then(report => {
      if (report.data.length == 0) { //if report does not exist...
        const content = {id: galleryID, view_count: 1, like_count: 0 ,user_name: "liam", type: "Project", title:"", text: "hii"};  //getGalleryPost() should be used to populate this data
        let studentID = sessionStorage.getItem('user')
        if(studentID){
          studentID = studentID.substring(1, studentID.length - 1);
        }

        getStudent(studentID).then(student =>{
          createReport(content, student.data)  //create the report
        })
        
      } 
      else { //otherwise...
        let studentID = sessionStorage.getItem('user')
        if(studentID){
          studentID = studentID.substring(1, studentID.length - 1);
        }
        
        getStudent(studentID).then(student =>{
          let newReporters = report.data[0].students;
          if(!newReporters.some(reporter => reporter.id == studentID)){
            newReporters.push(student.data);
            updateReporters(report.data[0], newReporters); //add user to list of reporters
          }
        })

        getReport(report.data[0].id).then(report => {
          console.log(report);
          let thresholdResult = parseInt(report.data.report_count) + 1; //evaluate threshold
          if(thresholdResult >= 5){
            updateGloballyHidden(report.data.id, 1);
          }
        })
      }
    }) 


    //hideContent(galleryID); //call locally hidden function from gallery team

  }

  function Unflag() { //unflag content
    alert("The content has been unflagged! Unique key: " + galleryID);
    setStatus("Unclicked");
    setClicked(false);
    let studentID = sessionStorage.getItem('user')
    if(studentID){
      studentID = studentID.substring(1, studentID.length - 1);
    }
    getReportFromGalleryID(galleryID).then(report =>{
      //remove student from students list
      let newReporters = report.data[0].students.filter( student => student.id != studentID);
      //update report count
      updateReporters(report.data[0], newReporters);
      let thresholdResult = parseInt(report.data[0].report_count) - 1;
      if(thresholdResult < 5){
        //if report count is under 4, remove globally hidden
        updateGloballyHidden(report.data[0].id, 0);
        //if report count is 0, delete the report
        if((report.data[0].report_count - 1) == 0){
          deleteReport(report.data[0].id);
        }
      }
    }) 
    .catch(error => {
      console.log("Couldn't retrieve report data");
    })

    //   unhideContent(galleryID, userID); //call locally unhide function from gallery team
  }

  return (
    <span className ={status}>
        <Button className="flag" onClick={ HandleClick }> </Button>
    </span>
  );
}
