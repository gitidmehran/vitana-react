import React from "react";
import { Button, DatePicker, Radio, Select, Input, Space } from "antd";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  GeneralAssessmentType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import moment from "moment";
import { useAppSelector } from "../../../hooks/hooks";

const { TextArea } = Input;

const GeneralAssesment = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
  patientdata,
  disableFirstSeven,
}: QuestionaireStepProps) => {
  const {
    loading,
    diagnosis,
    question: { general_assessment },
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const activeDiagnosis = [] as any;

  Object.entries(diagnosis).map(([keys, values]) => {
    if (values === "true") {
      const val = keys
        .replace(/(_|-)/g, " ")
        .trim()
        .replace(/\w\S*/g, function (str) {
          return str.charAt(0).toUpperCase() + str.substr(1);
        })
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
      activeDiagnosis.push(val);
    }
  });
  const dateFormat = "MM/DD/YYYY";
  const defaultOptions = ["Yes", "No"];
  const daysPerWeek = ["1", "2", "3", "4", "5", "6", "7"];
  const minutesPerDay = ["0", "10", "20", "30", "40", "50", "60"];
  const patientMedication = patientdata?.medication;

  const { Option } = Select;

  const medicationsList: JSX.Element[] = [];
  patientMedication?.forEach(function (item: any) {
    medicationsList?.push(<Option value={item.name}>{item.name}</Option>);
  });

  const [generalAssessment, setGeneralAssessment] =
    React.useState<GeneralAssessmentType>(general_assessment as GeneralAssessmentType);

  const dates = {
    imp_handwash_start_date: generalAssessment?.imp_handwash_start_date
      ? moment(generalAssessment?.imp_handwash_start_date)
      : undefined,
    imp_handwash_end_date: generalAssessment?.imp_handwash_end_date
      ? moment(generalAssessment?.imp_handwash_end_date)
      : undefined,
    und_handwash_start_date: generalAssessment?.und_handwash_start_date
      ? moment(generalAssessment?.und_handwash_start_date)
      : undefined,
    und_handwash_end_date: generalAssessment?.und_handwash_end_date
      ? moment(generalAssessment?.und_handwash_end_date)
      : undefined,
    washwithsoap_start_date: generalAssessment?.washwithsoap_start_date
      ? moment(generalAssessment?.washwithsoap_start_date)
      : undefined,
    washwithsoap_end_date: generalAssessment?.washwithsoap_end_date
      ? moment(generalAssessment?.washwithsoap_end_date)
      : undefined,
    und_washhands_start_date: generalAssessment?.und_washhands_start_date
      ? moment(generalAssessment?.und_washhands_start_date)
      : undefined,
    und_washhands_end_date: generalAssessment?.und_washhands_end_date
      ? moment(generalAssessment?.und_washhands_end_date)
      : undefined,
    turnoff_faucet_start_date: generalAssessment?.turnoff_faucet_start_date
      ? moment(generalAssessment?.turnoff_faucet_start_date)
      : undefined,
    turnoff_faucet_end_date: generalAssessment?.turnoff_faucet_end_date
      ? moment(generalAssessment?.turnoff_faucet_end_date)
      : undefined,
    understand_faucet_start_date:
      generalAssessment?.understand_faucet_start_date
        ? moment(generalAssessment?.understand_faucet_start_date)
        : undefined,
    understand_faucet_end_date: generalAssessment?.understand_faucet_end_date
      ? moment(generalAssessment?.understand_faucet_end_date)
      : undefined,
    plain_soap_usage_start_date: generalAssessment?.plain_soap_usage_start_date
      ? moment(generalAssessment?.plain_soap_usage_start_date)
      : undefined,
    plain_soap_usage_end_date: generalAssessment?.plain_soap_usage_end_date
      ? moment(generalAssessment?.plain_soap_usage_end_date)
      : undefined,
    bar_or_liquid_start_date: generalAssessment?.bar_or_liquid_start_date
      ? moment(generalAssessment?.bar_or_liquid_start_date)
      : undefined,
    bar_or_liquid_end_date: generalAssessment?.bar_or_liquid_end_date
      ? moment(generalAssessment?.bar_or_liquid_end_date)
      : undefined,
    uips_start_date: generalAssessment?.uips_start_date
      ? moment(generalAssessment?.uips_start_date)
      : undefined,
    uips_end_date: generalAssessment?.uips_end_date
      ? moment(generalAssessment?.uips_end_date)
      : undefined,
    no_soap_condition_start_date:
      generalAssessment?.no_soap_condition_start_date
        ? moment(generalAssessment?.no_soap_condition_start_date)
        : undefined,
    no_soap_condition_end_date: generalAssessment?.no_soap_condition_end_date
      ? moment(generalAssessment?.no_soap_condition_end_date)
      : undefined,
    understand_hand_sanitizer_start_date:
      generalAssessment?.understand_hand_sanitizer_start_date
        ? moment(generalAssessment?.understand_hand_sanitizer_start_date)
        : undefined,
    understand_hand_sanitizer_end_date:
      generalAssessment?.understand_hand_sanitizer_end_date
        ? moment(generalAssessment?.understand_hand_sanitizer_end_date)
        : undefined,
  };

  const [takingMedication, setMedicationBody] = React.useState<boolean>(
    Boolean(generalAssessment?.is_taking_medication === "No") ?? false
  );

  const [state, setState] = React.useState<any>({
    showElement: false,
  });

  React.useEffect(() => {
    const show = generalAssessment?.is_consuming_tobacco === "Yes";
    setState({ state, showElement: show });
  }, [generalAssessment?.is_consuming_tobacco]);

  /* Use Effect for Medication Body */
  React.useEffect(() => {
    const takingMedications = generalAssessment?.is_taking_medication;

    if (takingMedications === "Yes") {
      setGeneralAssessment({
        ...generalAssessment,
        prescribed_medications: [],
        reason_for_not_taking_medication: "",
      });
    }
    setMedicationBody(Boolean(takingMedications === "No"));
  }, [generalAssessment?.is_taking_medication]);

  function valueChange(e: any) {
    const value = e.target.value;
    setGeneralAssessment({
      ...generalAssessment,
      [e.target.name]: value,
    });
  }

  function selectMedications(name: string, value: any) {
    setGeneralAssessment({
      ...generalAssessment,
      [name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setGeneralAssessment({
      ...generalAssessment,
      [name]: value,
    });
  }

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const genAssessment = { ...generalAssessment };
    Object.assign(genAssessment, completed);

    const response = await saveQuestionairsData(
      "general_assessment",
      genAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  const handleSave = async () => {
    const completed = { completed: "1" };
    const genAssessment = { ...generalAssessment };
    Object.assign(genAssessment, completed);

    const response = await saveQuestionairsData(
      "general_assessment",
      genAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">General Assessment</h2>
        <h4>Medication Reconciliation</h4>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <span className="text-dark">
              Are you taking all medications for {' '}
              <b>
                {activeDiagnosis
                  .toString()
                  .replaceAll(",", ", ")
                  .replace(/,(?=[^,]+$)/, " &")}
              </b>
              {' '}as prescribed?
            </span>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <Radio.Group
              name="is_taking_medication"
              value={generalAssessment?.is_taking_medication}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="horizontal">
                {defaultOptions.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>

        {takingMedication && (
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <h6>Which medications are not being taken as prescribed?</h6>
            </div>
            <div className="col-lg-6 md-6 sm-6">
              <Select
                placeholder="Select Medication"
                onChange={(e) => selectMedications("prescribed_medications", e)}
                mode="multiple"
                allowClear
                value={generalAssessment?.prescribed_medications}
                style={{ width: "100%" }}
              >
                <>
                  {medicationsList}
                  {/* <Option value="Medication 1">Medication 1</Option>
                  <Option value="Medication 2">Medication 2</Option> */}
                </>
              </Select>
            </div>
            <div className="col-lg-6 md-6 sm-12">
              <label className="question-text">Reason</label>
              <TextArea
                name="reason_for_not_taking_medication"
                value={generalAssessment?.reason_for_not_taking_medication}
                onChange={(e) => valueChange(e)}
                placeholder="Reason for not taking medications"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>
          </div>
        )}

        <h4>Lifestyle Assessment</h4>
        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <span>In the last 30 days, have you used tobacco?</span>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <Radio.Group
              name="is_consuming_tobacco"
              value={generalAssessment?.is_consuming_tobacco}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="horizontal">
                {defaultOptions.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>

        <div className={state.showElement ? "row mb-3" : "d-none"}>
          <div className="col-lg-6 md-6 sm-12">
            <span>
              Would you be interested in quitting tobacco use within the next
              month?
            </span>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <Radio.Group
              name="quitting_tobacco"
              value={generalAssessment?.quitting_tobacco}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="horizontal">
                {defaultOptions.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <span>
              In the last 30 days, other than the activities you did for work,
              on average, how many days per week did you engage in moderate
              exercise (like walking fast, running, jogging, dancing, swimming,
              biking, or other similar activities)?
            </span>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <Radio.Group
              name="physical_exercises"
              value={generalAssessment?.physical_exercises}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="horizontal">
                {daysPerWeek.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <span>
              On average, how many minutes did you usually spend exercising at
              this level on one of those days?
            </span>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <Radio.Group
              name="physical_exercise_level"
              value={generalAssessment?.physical_exercise_level}
              onChange={(e) => valueChange(e)}
            >
              <Space direction="horizontal">
                {minutesPerDay.map((item, key) => (
                  <Radio value={item} key={key}>
                    {item}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <h6><b>General Hygiene Goal</b></h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <h6><b>Start Date</b></h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <h6><b>End Date</b></h6>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-6">
            <label>
              <b>
                To Understand importance of Hand Washing in Infection Controls
              </b>
            </label>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p className="pl-5">
              <b>Instructed on Importance of Hand Washing</b>
              <br />
              Scientific studies show that you need to scrub for 20 seconds to
              remove harmful germs and chemicals from your hands. If you wash
              for a shorter time, you will not remove as many germs. Make sure
              to scrub all areas of your hands, including your palms, backs of
              your hands, between your fingers, and under your fingernails.
              <br />
              Patient shows understanding of Importance of Hand Washing.
            </p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="imp_handwash_start_date"
              value={dates.imp_handwash_start_date}
              onChange={(e, datestring) =>
                dateChange("imp_handwash_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="imp_handwash_end_date"
              value={dates.imp_handwash_end_date}
              onChange={(e, datestring) =>
                dateChange("imp_handwash_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <h6>Patient shows understanding of Importance of Hand Washing</h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="und_handwash_start_date"
              value={dates.und_handwash_start_date}
              onChange={(e, datestring) =>
                dateChange("und_handwash_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="und_handwash_end_date"
              value={dates.und_handwash_end_date}
              onChange={(e, datestring) =>
                dateChange("und_handwash_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div> */}

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p className="pl-5">
              <b>Instructed on how washing with Soap remove germs</b>
              <br />
              Soap and water, worked into a lather, trap and remove germs and
              chemicals from hands. Wetting your hands with clean water before
              applying soap helps you get a better lather than applying soap to
              dry hands. A good lather forms pockets called micelles that trap
              and remove germs, harmful chemicals, and dirt from your hands.
              Lathering with soap and scrubbing your hands for 20 seconds is
              important to this process because these actions physically destroy
              germs and remove germs and chemicals from your skin. When you
              rinse your hands, you wash the germs and chemicals down the drain.
              <br />
              Patient shows understanding on how washing with Soap remove germs.
            </p>
          </div>

          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="washwithsoap_start_date"
              value={dates.washwithsoap_start_date}
              onChange={(e, datestring) =>
                dateChange("washwithsoap_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="washwithsoap_end_date"
              value={dates.washwithsoap_end_date}
              onChange={(e, datestring) =>
                dateChange("washwithsoap_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <h6>
              Patient shows understanding on how washing with Soap remove germs
            </h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="und_washhands_start_date"
              value={dates.und_washhands_start_date}
              onChange={(e, datestring) =>
                dateChange("und_washhands_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="und_washhands_end_date"
              value={dates.und_washhands_end_date}
              onChange={(e, datestring) =>
                dateChange("und_washhands_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div> */}

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p className="pl-5">
              <b>Instructed on proper way to turn off the faucet</b>
              <br />
              CDC recommends turning off the faucet after wetting your hands to
              reduce water use. Then, turn it on again after you have washed
              them for 20 seconds, to rinse off the soap. If you are concerned
              about getting germs on your hands after you wash them, you can use
              a paper towel, your elbow, or another hands-free way to turn off
              the faucet.
              <br />
              Patient shows understanding on proper way to turn off the faucet.
            </p>
          </div>

          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="turnoff_faucet_start_date"
              value={dates.turnoff_faucet_start_date}
              onChange={(e, datestring) =>
                dateChange("turnoff_faucet_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="turnoff_faucet_end_date"
              value={dates.turnoff_faucet_end_date}
              onChange={(e, datestring) =>
                dateChange("turnoff_faucet_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/*  <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <h6>
              Patient shows understanding on proper way to turn off the faucet
            </h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="understand_faucet_start_date"
              value={dates.understand_faucet_start_date}
              onChange={(e, datestring) =>
                dateChange("understand_faucet_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="understand_faucet_end_date"
              value={dates.understand_faucet_end_date}
              onChange={(e, datestring) =>
                dateChange("understand_faucet_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div> */}

        {/* <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <h6>Patient shows understanding of using plain Soap</h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="plain_soap_usage_start_date"
              value={dates.plain_soap_usage_start_date}
              onChange={(e, datestring) =>
                dateChange("plain_soap_usage_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="plain_soap_usage_end_date"
              value={dates.plain_soap_usage_end_date}
              onChange={(e, datestring) =>
                dateChange("plain_soap_usage_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div> */}

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p className="pl-5">
              <b>Is Bar Soap or Liquid Soap better?</b>
              <br />
              Both bar and liquid soap work well to remove germs. Use plain soap
              in either bar or liquid form to wash your hands.
              <br />
              Patient shows understanding about importance of plain soap in any
              form.
            </p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="bar_or_liquid_start_date"
              value={dates.bar_or_liquid_start_date}
              onChange={(e, datestring) =>
                dateChange("bar_or_liquid_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="bar_or_liquid_end_date"
              value={dates.bar_or_liquid_end_date}
              onChange={(e, datestring) =>
                dateChange("bar_or_liquid_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p className='pl-5'>
              <b>Which Soap is better: Plain or Anti-bacterial Soap?</b>
              <br />
              Use plain soap and water to wash your hands. Studies have not
              found any added health benefit from using antibacterial soap,
              other than for professionals in healthcare settings. In 2016, FDA
              banned over-the-counter sale of antibacterial soaps that contain
              certain ingredients external icon because these soaps are no
              better than plain soap at preventing people from getting sick and
              their ingredients may not be safe for long-term, daily use. Some
              studies external icon have shown that using antibacterial soap may
              contribute to antibiotic resistance.
              <br />
              Patient shows understanding of using plain Soap.
            </p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="uips_start_date"
              value={dates.uips_start_date}
              onChange={(e, datestring) =>
                dateChange("uips_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="uips_end_date"
              value={dates.uips_end_date}
              onChange={(e, datestring) =>
                dateChange("uips_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <p className='pl-5'><b>What if there is no Soap?</b>
              <br />
              If you don't have soap and water, use a hand sanitizer with at
              least 60% alcohol. If you don't have hand sanitizer or soap, but
              do have water, rub your hands together under the water and dry
              them with a clean towel or air dry. Rubbing your hands under water
              will rinse some germs from your hands, even though it's not as
              effective as washing with soap.
              <br />
              Patient shows understanding about Hand Sanitizer?.
            </p>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="no_soap_condition_start_date"
              value={dates.no_soap_condition_start_date}
              onChange={(e, datestring) =>
                dateChange("no_soap_condition_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="no_soap_condition_end_date"
              value={dates.no_soap_condition_end_date}
              onChange={(e, datestring) =>
                dateChange("no_soap_condition_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <h6>Patient shows understanding about Hand Sanitizer?</h6>
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="understand_hand_sanitizer_start_date"
              value={dates.understand_hand_sanitizer_start_date}
              onChange={(e, datestring) =>
                dateChange("understand_hand_sanitizer_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="understand_hand_sanitizer_end_date"
              value={dates.understand_hand_sanitizer_end_date}
              onChange={(e, datestring) =>
                dateChange("understand_hand_sanitizer_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
        </div> */}
        <div className="row mb-3">
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">Comments</label>
            <textarea
              className="form-control"
              name="comments"
              value={generalAssessment?.comments ?? ""}
              defaultValue={generalAssessment?.comments ?? ""}
              spellCheck="false"
              onChange={valueChange}
            >
            </textarea>
          </div>
        </div>



        <Space>
          {disableFirstSeven === false ? (
            <Button type="primary" onClick={() => handlePreviousStep?.()}>
              Back
            </Button>
          ) : null}
          <Button loading={loading} onClick={async () => await SaveAndNext()}>
            Save and Next
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={async () => await handleSave()}
          >
            Finish and Next
          </Button>
        </Space>
      </div>
    </>
  );
};
export default GeneralAssesment;
