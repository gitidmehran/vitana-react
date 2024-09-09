import QuestionairesReducer from "./QuestionairesReducer";
import PatientReducer from "./PatientReducer";
import DashboardReducer from "./DashboardReducer";
import ClinicReducer from "./ClinicReducer";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
  questionairesReduer: QuestionairesReducer,
  PatientService: PatientReducer,
  DashboardFilters: DashboardReducer,
  clinicReducer: ClinicReducer,
});

export default rootReducer;
