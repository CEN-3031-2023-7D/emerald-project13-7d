import { server } from './hosts';
import axios from 'axios';
import { getToken } from './AuthRequests';

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';
const SEARCH = 'SEARCH';

// all request functions should utilize makeRequest and return an obj with structure {data, err}
const makeRequest = async ({ method, path, data, auth = false, params = null, error }) => {
  //console.log(data);
  let res = null;
  let err = null;
  const config = auth
    ? {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    : null;

  try {
    switch (method) {
      case GET:
        res = (await axios.get(path, config)).data;
        break;
      case POST:
        res = (await axios.post(path, data, config)).data;
        break;
      case PUT:
        res = (await axios.put(path, data, config)).data;
        break;
      case DELETE:
        res = (await axios.delete(path, config)).data;
        break;
      case SEARCH:
        res = (await axios.get(path, params, config)).data;
        break;
      default:
        throw Error('Invalid method.');
    }
  } catch (e) {
    console.error(e);
    err = error ? error : 'An error occurred.';
  }

  return { data: res, err: err };
};

export const getActivities = async () =>
  makeRequest({
    method: GET,
    path: `${server}/activities`,
    auth: true,
    error: 'Activities could not be retrieved.',
  });

export const getTeachers = async () =>
  makeRequest({
    method: GET,
    path: `${server}/mentors`,
    auth: true,
    error: 'Teachers could not be retrieved.',
  });

export const getAllClassrooms = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms`,
    auth: true,
    error: 'Classrooms could not be retrieved.',
  });

export const getAllStudents = async () =>
  makeRequest({
    method: GET,
    path: `${server}/students`,
    auth: true,
    error: 'Students could not be retrieved.',
  });

export const getActivityToolboxAll = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sandbox/toolbox`,
    error: 'Toolbox could not be retrieved.',
  });

// export cost getActivityLevels = async () =>
//   makeRequest({
//     method: GET,
//     path: `${server}/activities/`
//   })

// export const getLessonModuleActivities = async (lsId) =>
//   makeRequest({
//     method: GET,
//     path: `${server}/activities?lesson_module.id=${lsId}`,
//     auth: true,
//     error: 'Activity cannot be retrived',
//   });
export const getActivityToolbox = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/activities/toolbox/${id}`,
    auth: true,
    error: 'Toolbox could not be retrieved.',
  });

export const getMentor = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classroom-managers/me`,
    auth: true,
    error: 'Your classroom manager information could not be retrieved.',
  });

export const getClassroom = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/${id}`,
    auth: true,
    error: 'Classroom information could not be retrieved',
  });

export const getStudentClassroom = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/student`,
    auth: true,
    error: 'Classroom information could not be retrieved',
  });

export const getClassrooms = async (ids) =>
  Promise.all(ids.map(async (id) => (await getClassroom(id)).data));

export const getStudents = async (code) =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/join/${code}`,
    error: 'Student info could not be retrieved.',
  });

export const getStudent = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/students/${id}`,
    auth: true,
    error: 'Student info could not be retrieved.',
  });

export const postJoin = async (code, ids) =>
  makeRequest({
    method: POST,
    path: `${server}/classrooms/join/${code}`,
    data: {
      students: ids,
    },
    error: 'Login failed.',
  });

export const createActivity = async (activity, learningStandard) =>
  makeRequest({
    method: POST,
    path: `${server}/activities`,
    data: {
      lesson_module: learningStandard,
      number: activity,
      template: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>)',
    },
    auth: true,
    error: 'Login failed.',
  });

export const setEnrollmentStatus = async (id, enrolled) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/enrolled/${id}`,
    data: {
      enrolled: enrolled,
    },
    auth: true,
    error: 'Failed to change enrollment status.',
  });

export const updateStudent = async (id, student) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/${id}`,
    data: student,
    auth: true,
    error: 'Failed to update student.',
  });

export const getUnits = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/units?grade=${id}`,
    auth: true,
    error: 'Failed to retrieve units.',
  });

export const getLessonModule = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/lesson-modules/${id}`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getUnit = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/units/${id}`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getAllUnits = async () =>
  makeRequest({
    method: GET,
    path: `${server}/units`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getLessonModulecount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/lesson-modules/count`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getLessonModuleAll = async () =>
  makeRequest({
    method: GET,
    path: `${server}/lesson-modules?_sort=unit.name:ASC,name:ASC`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const setSelection = async (classroom, learningStandard) =>
  makeRequest({
    method: POST,
    path: `${server}/selections/`,
    data: {
      classroom: classroom,
      lesson_module: learningStandard,
    },
    auth: true,
    error: 'Failed to set active learning standard.',
  });

export const saveWorkspace = async (activity, workspace, replay) =>
  makeRequest({
    method: POST,
    path: `${server}/saves`,
    data: {
      activity,
      workspace,
      replay,
    },
    auth: true,
    error: 'Failed to save your workspace.',
  });

export const getSaves = async (activity) =>
  makeRequest({
    method: GET,
    path: `${server}/saves/activity/${activity}`,
    auth: true,
    error: 'Past saves could not be retrieved.',
  });

export const getSave = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/saves/${id}`,
    auth: true,
    error: 'Save could not be retrieved.',
  });

export const createSubmission = async (id, workspace, sketch, path, isAuth) =>
  makeRequest({
    method: POST,
    path: `${server}${path}`,
    data: {
      activity: id,
      workspace: workspace,
      board: 'arduino:avr:uno',
      sketch: sketch,
    },
    auth: isAuth,
    error: 'Failed to create submission.',
  });

export const getSubmission = async (submissionId, path, isAuth) =>
  makeRequest({
    method: GET,
    path: `${server}${path}/${submissionId}`,
    auth: isAuth,
    error: 'Failed to retrieve submission status',
  });

export const addStudent = async (name, character, classroom) =>
  makeRequest({
    method: POST,
    path: `${server}/students`,
    data: {
      name: name,
      character: character,
      classroom: classroom,
    },
    auth: true,
    error: 'Failed to add student.',
  });

export const addStudents = async (students, classroom) =>
  makeRequest({
    method: POST,
    path: `${server}/students`,
    data: { students: students, classroom: classroom },
    auth: true,
    error: 'Failed to add students.',
  });

export const deleteStudent = async (student) =>
  makeRequest({
    method: DELETE,
    path: `${server}/students/${student}`,
    auth: true,
    error: 'Failed to delete student.',
  });

export const updateActivityLevelTemplate = async (id, workspace, blocksList) =>
  makeRequest({
    method: PUT,
    path: `${server}/activities/template/${id}`,
    data: {
      template: workspace,
      blocks: blocksList,
    },
    auth: true,
    error: 'Failed to update the template for the activity',
  });

export const updateActivityTemplate = async (id, workspace) =>
  makeRequest({
    method: PUT,
    path: `${server}/activities/activity_template/${id}`,
    data: {
      activity_template: workspace,
      //blocks: blocksList,
    },
    auth: true,
    error: 'Failed to update the activity template for the activity',
  });

export const deleteActivity = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/activities/${id}`,
    auth: true,
    error: 'Failed to delete activity.',
  });

export const deleteLessonModule = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/lesson-modules/${id}`,
    auth: true,
    error: 'Failed to delete student.',
  });

export const createLessonModule = async (
  description,
  name,
  number,
  unit,
  standards,
  link
) =>
  makeRequest({
    method: POST,
    path: `${server}/lesson-modules`,
    data: {
      expectations: description,
      name,
      number,
      unit,
      standards,
      link,
    },
    auth: true,
    error: 'Login failed.',
  });

export const createUnit = async (number, name, standardsID, standardsDescrip, grade) =>
  makeRequest({
    method: POST,
    path: `${server}/units`,
    data: {
      number: parseInt(number, 10),
      name: name,
      grade: parseInt(grade, 10),
      standards_id: standardsID,
      standards_description: standardsDescrip,
    },
    auth: true,
    error: 'Fail to create new unit.',
  });

export const updateUnit = async (
  id,
  number,
  name,
  standardsID,
  standardsDescrip,
  grade
) =>
  makeRequest({
    method: PUT,
    path: `${server}/units/${id}`,
    data: {
      number: parseInt(number, 10),
      name: name,
      grade: parseInt(grade, 10),
      standards_id: standardsID,
      standards_description: standardsDescrip,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const getGrades = async () =>
  makeRequest({
    method: GET,
    path: `${server}/grades`,
    auth: true,
    error: 'Grades could not be retrieved',
  });

export const getGrade = async (grade) =>
  makeRequest({
    method: GET,
    path: `${server}/grades/${grade}`,
    auth: true,
    error: 'Grade could not be retrieved',
  });

export const updateLessonModule = async (
  id,
  name,
  expectations,
  standards,
  link
) =>
  makeRequest({
    method: PUT,
    path: `${server}/lesson-modules/${id}`,
    data: {
      name,
      standards,
      expectations,
      link,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const updateActivityDetails = async (
  id,
  description,
  // template,
  // activity_template,
  StandardS,
  images,
  link,
  scienceComponents,
  makingComponents,
  computationComponents
) =>
  makeRequest({
    method: PUT,
    path: `${server}/activities/${id}`,
    data: {
      description,
      // template,
      // activity_template,
      StandardS,
      images,
      link,
      scienceComponents,
      makingComponents,
      computationComponents,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const getLessonModuleActivities = async (lsId) =>
  makeRequest({
    method: GET,
    path: `${server}/activities?lesson_module.id=${lsId}`,
    auth: true,
    error: 'Activity cannot be retrived',
  });

  export const getActivityLevels = async (lsId) =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces?activities.id=${lsId}`,
    auth: true,
    error: 'Activities cannot be retrieved',
  });

export const getActivity = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/activities/${id}`,
    auth: true,
    error: 'Activity cannot be retrived',
  });

export const forgetPassword = async (email) =>
  makeRequest({
    method: POST,
    path: `${server}/auth/forgot-password`,
    data: {
      email,
    },
    error: 'cannot retrive data from the provided email',
  });

export const resetPassword = async (code, password, passwordConfirmation) =>
  makeRequest({
    method: POST,
    path: `${server}/auth/reset-password`,
    data: {
      code,
      password,
      passwordConfirmation,
    },
    error:
      'Cannot update new password. Please try again or get a new link from the forgot password page.',
  });

export const getSessions = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sessions`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });

export const getSessionsWithFilter = async (filterOptions) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions?${filterOptions}`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });

export const getSessionCount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/count`,
    auth: true,
    error: 'Session count could not be retrieved.',
  });

export const getSessionCountWithFilter = async (filterOptions) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/count?${filterOptions}`,
    auth: true,
    error: 'Session count could not be retrieved.',
  });

export const getSession = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/${id}`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });
export const submitBugReport = async (
  description,
  steps,
  name,
  email,
  systemInfo
) =>
  makeRequest({
    method: POST,
    path: `${server}/bug-report`,
    data: {
      description,
      steps,
      name,
      email,
      systemInfo,
    },
    error: 'Unable to submit bug-report',
  });

export const getAuthorizedWorkspaces = async () =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces`,
    auth: true,
    error: 'Unable to retrive cc worksapces',
  });

export const getAuthorizedWorkspace = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces/${id}`,
    auth: true,
    error: 'Unable to retrive cc workspace',
  });

export const createAuthorizedWorkspace = async (
  name,
  description,
  template,
  blocks,
  classroomId
) =>
  makeRequest({
    method: POST,
    path: `${server}/authorized-workspaces`,
    auth: true,
    data: {
      name,
      description,
      template,
      blocks,
      classroomId,
    },
    error: 'Unable to create cc workspace',
  });
export const getAuthorizedWorkspaceToolbox = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces/toolbox/${id}`,
    auth: true,
    error: 'Toolbox could not be retrieved.',
  });

export const updateAuthorizedWorkspace = async (id, template, blocks) =>
  makeRequest({
    method: PUT,
    path: `${server}/authorized-workspaces/${id}`,
    auth: true,
    data: {
      template,
      blocks,
    },
    error: 'Unable to create cc workspace',
  });
export const deleteAuthorizedWorkspace = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/authorized-workspaces/${id}`,
    auth: true,
    error: 'Unable to delete cc workspace',
  });

export const getClassroomWorkspace = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/classroom/workspaces/${id}`,
    auth: true,
    error: 'Unable to retrive classroom workspaces',
  });

//gets a singular report based off of the report's id
export const getReport = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/reports/${id}`,
    auth: true,
    error: 'Unable to retrive report',
  });

//gets a report based off of the unique_key in the database
export const getReportFromGalleryID = async (galleryID) =>
  makeRequest({
    method: SEARCH,
    path: `${server}/reports`,
    auth: true,
    params: {params: {unique_key: galleryID}},
    error: 'Unable to retrive report',
  });

//most likely need to change this to get a single report as this will allow the passing of an object into the update/create functions
export const getReports = async () => 
  makeRequest({
    method: GET,
    path: `${server}/reports`,
    auth: true,
    error: 'Unable to retrive reports',
  });

//when the flag button is pressed, this function is called to create a report in the database
export const createReport = async (
  content, user
  ) =>
  makeRequest({
    method: POST,
    path: `${server}/reports`,
    auth: true,
    data: {
      unique_key: content.id,  //id given by gallery team
      views: content.view_count,   //views given by gallery team
      report_count: 1,        //set report count to 1 on creation
      user_name: content.user_name, //pull the student's info from gallery team
      report_status: "pending",      //set initial status to pending
      students: [user],                    
      content_type: content.type,    //from gallery team
      content_title: content.title,  //from gallery team
      content_text: content.text,     //from gallery team
      globally_hidden: false            //set globally hidden to 0 initially
    },
    error: 'Unable to create report',
  });

//when the admin makes an update to the report, this function is called in order to update the report status
export const updateReport = async (
  unique_key,
  views,
  report_count,
  user_name,
  globally_hidden,
  report_status,
  id
) =>
  makeRequest({
    method: PUT,
    path: `${server}/reports/${id}`,
    data: {
      unique_key: unique_key,
      views: views,
      report_count: report_count,
      user_name: user_name,
      globally_hidden: globally_hidden,
      report_status: report_status,
    },
    auth: true,
    error: 'Failed to update report',
  });

export const updateReporters = async (
  report, newReportersArray
) =>
  makeRequest({
    method: PUT,
    path: `${server}/reports/${report.id}`,
    data: {
      unique_key: report.unique_key,
      views: report.views,
      report_count: newReportersArray.length,
      user_name: report.user_name,
      report_status: report.report_status,
      content_type: report.content_type,
      content_title: report.content_title,
      content_text: report.content_text,
      students: newReportersArray,
      globally_hidden: report.globally_hidden
    },
    auth: true,
    error: 'Failed to add reporter to the report',
  });

export const updateGloballyHidden = async (
  id, globallyHidden
) =>
  makeRequest({
    method: PUT,
    path: `${server}/reports/${id}`,
    data: {
      globally_hidden: globallyHidden,
    },
    auth: true,
    error: 'Failed to update report globally hidden status',
});

export const deleteReport = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/reports/${id}`,
    auth: true,
    error: 'Failed to delete report.',
  });
  
export const updateReportStatus = async (
    id, reportStatus
  ) =>
    makeRequest({
      method: PUT,
      path: `${server}/reports/${id}`,
      data: {
        report_status: reportStatus
      },
      auth: true,
      error: 'Failed to update report status',
  });