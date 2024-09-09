import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, Input, Radio, Space } from "antd";
import { OpenNotification } from "./../../../Utilties/Utilties";
import React from "react";
import {
  ObesityType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import DatePickerComponent from "../../DatePickerComponent/DatePickerComponent";

const Obesity: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const defaultOptions = ["Yes", "No"];
  const dateFormat = "MM/DD/YYYY";

  const {
    question: { obesity },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [obesityAssessment, setObesity] = React.useState<ObesityType>(obesity as ObesityType);

  const [showLostWeightBody, setShowLostWeightBody] = React.useState<boolean>(Boolean(obesityAssessment?.gained_weight === "No") ?? false);

  React.useEffect(() => {
    const gainedWeight = obesityAssessment?.gained_weight;
    if (gainedWeight === "Yes") {
      setObesity({
        ...obesityAssessment,
        lost_weight: "",
      });
    }

    setShowLostWeightBody(Boolean(obesityAssessment?.gained_weight === "No"));

  }, [obesityAssessment?.gained_weight, obesityAssessment?.lost_weight])

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const obesityAssessmentobj = { ...obesityAssessment };
    Object.assign(obesityAssessmentobj, completed);

    const response = await saveQuestionairsData(
      "obesity",
      obesityAssessmentobj
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const obesityAssessmentobj = { ...obesityAssessment };
    Object.assign(obesityAssessmentobj, completed);

    await saveQuestionairsData("obesity", obesityAssessmentobj);
    handleNextStep && handleNextStep();
  };

  const valuechange = (e: any) => {
    const value = e.target.value;

    setObesity({
      ...obesityAssessment,
      [e.target.name]: value,
    });
  };


  React.useEffect(() => {
    if (obesityAssessment?.height !== "" && obesityAssessment?.weight !== "") {

      const height = Number(obesityAssessment?.height ?? 0);
      const weight = Number(obesityAssessment?.weight ?? 0);
      const bmiResult = (weight / Math.pow(height, 2)) * 703;

      setObesity({
        ...obesityAssessment,
        bmi: bmiResult.toFixed(2),
      });
    }
  }, [obesityAssessment?.height, obesityAssessment?.weight])

  function dateChange(name: string, value: string) {
    setObesity({
      ...obesityAssessment,
      [name]: value,
    });
  }


  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Obesity</h2>

        <div className="row mb-2">
          <div className=" col-lg-12">
            <label className="question-text">
              Have you gained weight since last visit?
            </label>
            <Radio.Group
              name="gained_weight"
              onChange={(e) => { valuechange(e); }}
              className="ml-3"
              value={obesityAssessment?.gained_weight}
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

        {showLostWeightBody === true ? (
          <div id="results" className="mb-2">
            <div className="row">
              <div className="col-lg-6 md-6 sm-12">
                <label className="question-text">
                  Have you lost weight since last visit ?
                </label>
                <Radio.Group
                  name="lost_weight"
                  onChange={(e) => { valuechange(e) }}
                  className="ml-3"
                  value={obesityAssessment?.lost_weight}
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
          </div>
        ) : null}

        <div id="results" style={{ marginBottom: "15px" }} >
          <div className="row">
            <div className="col-lg-4 md-6 sm-12">
              <label className="question-text">Weight</label>
              <Input
                onChange={(e) => valuechange(e)}
                type="number"
                min="0"
                name="weight"
                className="form-control"
                placeholder="Weight in lbs"
                value={obesityAssessment?.weight}
              />
            </div>
            <div className="col-lg-4 md-6 sm-12">
              <label className="question-text">Height</label>
              <Input
                onChange={(e) => valuechange(e)}
                type="number"
                min="0"
                name="height"
                className="form-control"
                placeholder="Height in inches"
                value={obesityAssessment?.height}
              />
            </div>
            <div className="col-lg-4 md-6 sm-12">
              <label className="question-text">BMI</label>
              <Input
                onChange={(e) => valuechange(e)}
                type="number"
                min="0"
                name="bmi"
                className="form-control"
                placeholder="BMI"
                value={obesityAssessment?.bmi}
                disabled
              />
            </div>
          </div>
        </div>
        {/* {showBmiFieldBody === true ? (
        ) : null} */}

        <div className="row mb-2">
          <div className="col-12">
            <div className="row mb-2">
              <div className="col-6">
                <label>
                  <b>Treatment Goals</b>
                </label>
              </div>
              <div className="col-3">
                <label>
                  <b>Start Date</b>
                </label>
              </div>
              <div className="col-3">
                <label>
                  <b>End Date</b>
                </label>
              </div>
            </div>

            {/* GOAL 1 */}
            <div>
              <div className="row mb-2">
                <div className="col-lg-6 md-6 sm-12">
                  <label className=" mt-2">
                    <b>
                      Assessment of patient knowledge on Obesity, BMI and its effect on overall health.
                    </b>
                  </label>
                </div>
              </div>

              {/* Tasks */}
              <div>
                {/* TASK1 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To gain education and awareness about BMI and current BMI range.</b>
                      <p>
                        Doctors use a special measure called "body mass index," or "BMI," to help understand a person's weight. Your weight and height are used to calculate your BMI. Based on this number, you fall into 1 of the following categories:
                        <ul>
                          <li>Underweight – BMI under 18.5</li>
                          <li>Healthy weight – BMI between 18.5 and 24.9</li>
                          <li>Overweight – BMI between 25 and 29.9</li>
                          <li>Having obesity – BMI 30 or greater</li>
                        </ul>
                        Your doctor or nurse will often want to calculate your BMI at your medical appointments. But it's important to remember that your weight and BMI are just 1 piece of your overall health. Someone with a lower BMI might not be healthy overall, and someone with a higher BMI can still be healthy.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"bmi_awareness_start_date"}
                      value={obesityAssessment?.bmi_awareness_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"bmi_awareness_end_date"}
                      value={obesityAssessment?.bmi_awareness_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 2 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand how your weight affects your health.</b>
                      <p>
                        Having obesity increases the risks of many different health problems. It can also make it harder for you to move, breathe, and do other things that people who are at a healthy weight can do easily.
                      </p>
                      <p>
                        People with obesity are more likely to get diabetes, heart disease, cancer, and lots of other health problems. People with obesity also live less time than people of normal weight. That's why it's important to try to keep your weight in a healthy range.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weight_effect_start_date"}
                      value={obesityAssessment?.weight_effect_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weight_effect_end_date"}
                      value={obesityAssessment?.weight_effect_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand the importance of maintaining a healthy weight</b>
                      <p>
                        If you would like to lose weight, you can start by talking to your doctor or nurse. They can help you make a plan to lose weight in a healthy way. It can also help to work with a dietitian (food expert).
                      </p>
                      <p>
                        In general, to lose weight, you have to eat fewer calories and move your body more.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"maintain_healthy_weight_start_date"}
                      value={obesityAssessment?.maintain_healthy_weight_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"maintain_healthy_weight_end_date"}
                      value={obesityAssessment?.maintain_healthy_weight_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 4 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Understanding the effectiveness of different advertised diets</b>
                      <p>
                        Studies have compared different diets such as the Atkins diet, the Zone diet, and the Weight Watchers diet. No specific diet is better than any other. Any diet that reduces the number of calories you eat can help you lose weight, as long as you stick with it. You should try to find an eating pattern that works for you. A dietitian can help you make healthy changes to your diet while making sure that you get the nutrients your body needs.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"advertised_diets_start_date"}
                      value={obesityAssessment?.advertised_diets_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"advertised_diets_end_date"}
                      value={obesityAssessment?.advertised_diets_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 5 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Understanding the effectiveness of exercise and healthy habits</b>
                      <p>
                        Physical activity works the same way. You can walk, dance, garden, or even just move your arms while sitting. Even gentle forms of exercise are good for your health. For weight loss, the important thing is to increase the number of calories you burn by moving more. And you have to keep doing the extra activity.
                      </p>
                      <p>
                        If you go on a diet for a short time, or increase your activity for a while, you might lose weight. But you will regain the weight if you go back to your old habits. Weight loss is about changing your habits for the long term.
                      </p>
                      <p>
                        The best way to start is to make small changes and stick with them. Then, little by little, you can add new changes that you also stick with.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"healthy_habits_start_date"}
                      value={obesityAssessment?.healthy_habits_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"healthy_habits_end_date"}
                      value={obesityAssessment?.healthy_habits_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GOAL 2 */}
            <div>
              <div className="row mb-2">
                <div className="col-lg-6 md-6 sm-12">
                  <label className=" mt-2">
                    <b>
                      Assess knowledge on weight loss techniques and make a plan on working on weight loss with lifestyle changes and other measures.
                    </b>
                  </label>
                </div>
              </div>

              {/* Tasks */}
              <div>
                {/* TASK1 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on starting a weight loss program.</b>
                      <p>
                        It can really help to find a health care professional who has experience in helping people lose weight and make the lifestyle changes needed to keep the weight off. This could be a doctor, nurse, or other provider like a nurse practitioner or physician assistant. Developing a relationship with this person will help improve your chances of long-term success, as they can help you figure out the best plan for you, monitor your process, and provide advice and support along the way.
                      </p>
                      <p>
                        Different approaches and plans work for different people, so it's important to try not to get discouraged and to keep trying until you find something that works for you.
                      </p>
                      <p>
                        Be careful about misinformation online and weight loss clinics with questionable ethics. Nothing out there is magic. Losing weight takes hard work, and keeping it off requires a plan that is sustainable long-term.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weight_loss_program_start_date"}
                      value={obesityAssessment?.weight_loss_program_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weight_loss_program_end_date"}
                      value={obesityAssessment?.weight_loss_program_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 2 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Importance of BMI in Weight Loss Programs.</b>
                      <p>
                        The first step is to determine your starting point, which includes weighing yourself and measuring your waist circumference. The body mass index (BMI) is calculated from your height and weight.
                        <ul>
                          <li>A person with a BMI between 25 and 29.9 is considered overweight</li>
                          <li>A person with a BMI of 30 or greater is considered to have obesity</li>
                        </ul>
                        The BMI measurement provides an estimate of a person's total body fat, which is why experts find it more useful for assessing cardiovascular risk than a person's weight alone. However, it's not a perfect measure because it does not factor in variability in body composition. While most professional medical societies continue to recommend using a person's BMI when assessing risk, an experienced health care provider will also consider other factors (including a person's overall health) when making recommendations for how to achieve and maintain a healthy weight.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"bmi_importance_start_date"}
                      value={obesityAssessment?.bmi_importance_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"bmi_importance_end_date"}
                      value={obesityAssessment?.bmi_importance_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Importance of waist circumference in weight loss</b>
                      <p>
                        In general, a waist circumference greater than 35 inches (88 cm) in females and 40 inches (102 cm) in males increases the risk of obesity-related complications, such as heart disease and diabetes. People with obesity and who have a larger waist size may need more aggressive weight loss treatment than others. Your health care provider can talk to you about your situation, how to set short- and long-term goals, and how to start working toward those goals.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"waist_circumference_start_date"}
                      value={obesityAssessment?.waist_circumference_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"waist_circumference_end_date"}
                      value={obesityAssessment?.waist_circumference_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 4 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Different type of treatments to lose weight.</b>
                      <p>
                        Types of treatment — Based on your situation and medical history, your health care provider can help you determine what combination of weight loss treatments would work best for you. Treatments must include changes in lifestyle, physical activity, approach to eating, and, in some cases, weight loss medicines or a surgical procedure. Weight loss surgery, also called bariatric surgery, is reserved for people with obesity who have not had success with other approaches.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"treatment_type_start_date"}
                      value={obesityAssessment?.treatment_type_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"treatment_type_end_date"}
                      value={obesityAssessment?.treatment_type_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 5 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand the importance of setting weight loss goals.</b>
                      <p>
                        It is important to set a weight loss goal. Your first goal should be to avoid gaining more weight. Once you know your starting point, it is helpful to create milestones and health-related goals in order to start tracking your success.
                      </p>
                      <p>
                        If you are overweight or have obesity, losing 5 percent of your body weight is a reasonable initial weight loss goal. In the longer term, losing more than 15 percent of your body weight and staying at this weight is an extremely good result. However, keep in mind that even losing 5 percent of your body weight leads to important health benefits, so although your ultimate weight loss goal may be greater, try not to get discouraged if you're not able to lose more than this initially.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weight_loss_start_date"}
                      value={obesityAssessment?.weight_loss_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weight_loss_end_date"}
                      value={obesityAssessment?.weight_loss_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 6 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand the importance of “triggers” for eating.</b>
                      <p>
                        You can change your eating habits by breaking the chain of events between the trigger for eating and the act of eating. There are many ways to do this. For instance, you can:
                        <ul>
                          <li>Use a smaller plate for meals</li>
                          <li>Make a conscious effort to eat more slowly</li>
                          <li>Add more colorful (non-white) foods to your meals</li>
                          <li>Keep healthy snacks (like chopped raw vegetables, fruits, and nuts) around in case you get hungry between meals</li>
                        </ul>
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"eating_triggers_start_date"}
                      value={obesityAssessment?.eating_triggers_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"eating_triggers_end_date"}
                      value={obesityAssessment?.eating_triggers_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 7 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Understand healthy and un-healthy food.</b>
                      <p>
                        The types of foods we eat on a regular basis are related to whether we gain or lose weight over time. Whole grains, fruits, vegetables, nuts, and yogurt are associated with maintaining a lower weight, while foods like French fries or chips, sugar-sweetened beverages, and red or processed meats are associated with weight gain. High fructose-containing beverages, trans fats, and highly processed foods are particularly harmful for health and maintaining a healthy weight.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"healthy_unhealthy_start_date"}
                      value={obesityAssessment?.healthy_unhealthy_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"healthy_unhealthy_end_date"}
                      value={obesityAssessment?.healthy_unhealthy_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 8 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Understand different factors when losing weight.</b>
                      <p>
                        A calorie is a unit of energy found in food. Your body needs calories to function. If you are trying to lose weight, the goal of any eating plan is to burn up more calories than you eat.
                        <p>
                          How quickly you lose weight on a given calorie intake depends upon several factors, such as your age, sex, and starting weight. In general:
                          <ul>
                            <li>Older people have a slower metabolism than young people, so it takes longer for them to lose weight.</li>
                            <li>Males lose more weight than females of similar height and weight when dieting. This is because they have more muscle mass, which uses more energy.</li>
                            <li>People who are extremely overweight lose weight more quickly than those who are only mildly overweight.</li>
                          </ul>
                        </p>
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weightloss_factors_start_date"}
                      value={obesityAssessment?.weightloss_factors_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weightloss_factors_end_date"}
                      value={obesityAssessment?.weightloss_factors_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 9 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>How many calories do I need?</b>
                      <p>
                        The number of calories you need per day depends on your current (or target) weight, sex, and activity level. Your health care provider can help you figure out this number and how to modify your diet accordingly.
                      </p>
                      <p>
                        In general, it is best to choose foods that contain enough protein, carbohydrates, essential fatty acids, and vitamins. Try to avoid or at least limit alcohol, sugar-sweetened beverages (sodas and fruit drinks), and sweets (candy, cakes, cookies), since they have calories but generally lack important nutrients.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"calories_needed_start_date"}
                      value={obesityAssessment?.calories_needed_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"calories_needed_end_date"}
                      value={obesityAssessment?.calories_needed_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 10 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Are meal replacement plans good to count calories?</b>
                      <p>
                        Portion-controlled diets — One simple way to diet is to buy pre-packaged foods, like frozen low-calorie meals or meal-replacement canned drinks or bars. A typical meal plan for one day may include:
                        <ul>
                          <li>A meal-replacement drink or breakfast bar for breakfast</li>
                          <li>A meal-replacement drink or a frozen low-calorie (250 to 350 calories) meal for lunch</li>
                          <li>A frozen low-calorie meal or other prepackaged, calorie-controlled meal, along with extra vegetables for dinner</li>
                        </ul>
                        This would give you 1000 to 1500 calories per day.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"calories_count_start_date"}
                      value={obesityAssessment?.calories_count_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"calories_count_end_date"}
                      value={obesityAssessment?.calories_count_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 11 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>How to reduce fat in your diet?</b>
                      <p>
                        To reduce the amount of fat in your diet, you can:
                        <ul>
                          <li>Eat low-fat foods. You can look at the nutrition label to see how much fat is each serving of a food.</li>
                          <li>Count fat grams. For a 1500-calorie diet, this would mean about 45 g or fewer of fat per day.</li>
                        </ul>
                        If you try a low-fat diet, you should increase the amount of healthy carbohydrates in your diet (e.g., whole grains, fruits, and vegetables).
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"reduce_fat_start_date"}
                      value={obesityAssessment?.reduce_fat_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"reduce_fat_end_date"}
                      value={obesityAssessment?.reduce_fat_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 12 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>How to reduce Carbohydrate in your diet?</b>
                      <p>
                        Low- and very-low-carbohydrate diets (e.g., Atkins diet, South Beach diet, or "ketogenic" diet) are effective for weight loss and have become popular ways to lose weight quickly.
                        <ul>
                          <li>With a low-carbohydrate diet, you eat between 60 and 130 grams of carbohydrates per day.</li>
                          <li>With a very-low-carbohydrate diet, you eat between 0 and 60 grams of carbohydrates per day (a standard diet contains 200 to 300 grams of carbohydrates).</li>
                        </ul>
                        Carbohydrates are found in fruits, vegetables, grains (including breads, rice, pasta, and cereal), alcoholic beverages, and dairy products. Meat and fish contain very few carbohydrates. If you try a low carbohydrate diet, it's important to make healthy choices for fat and protein (e.g., fish, nuts, beans); eating a lot of saturated fats (found in butter and red meat) can increase your cholesterol level and raise your risk of heart disease.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"reduce_carbs_start_date"}
                      value={obesityAssessment?.reduce_carbs_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"reduce_carbs_end_date"}
                      value={obesityAssessment?.reduce_carbs_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 12 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>What is a Mediterranean diet?</b>
                      <p>
                        The term "Mediterranean diet" refers to a way of eating that is common in olive-growing regions around the Mediterranean Sea. Although there is some variation in Mediterranean diets, there are some similarities. Most Mediterranean diets include:
                        <ul>
                          <li>A high level of monounsaturated fats (from olive or canola oil, walnuts, pecans, almonds) and a low level of saturated fats (from butter).</li>
                          <li>high number of vegetables, fruits, legumes, and grains (7 to 10 servings of fruits and vegetables per day).</li>
                          <li>A moderate amount of milk and dairy products, mostly in the form of cheese. Use low-fat dairy products (skim milk, fat-free yogurt, low-fat cheese).</li>
                          <li>A relatively low amount of red meat and meat products. Substitute fish or poultry for red meat.</li>
                          <li>For those who drink alcohol, a modest amount (mainly as red wine) may help to protect against cardiovascular disease. A modest amount is up to one (4 ounce) glass per day for females and up to two glasses per day for males.</li>
                        </ul>
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"mediterranean_diet_start_date"}
                      value={obesityAssessment?.mediterranean_diet_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"mediterranean_diet_end_date"}
                      value={obesityAssessment?.mediterranean_diet_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* GOAL 3 */}
            <div>
              <div className="row mb-2">
                <div className="col-lg-6 md-6 sm-12">
                  <label className=" mt-2">
                    <b>
                      Assess Knowledge on Weight loss medications and supplements.
                    </b>
                  </label>
                </div>
              </div>

              {/* Tasks */}
              <div>
                {/* TASK1 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate on weight loss medications.</b>
                      <p>
                        Medication may be helpful for weight loss when used in combination with diet, exercise, and lifestyle changes. However, it is important to understand the risks, benefits, and limitations of these medicines. They can cause side effects that may be bothersome, and in many cases the long-term safety data are limited. In addition, these medicines may not be covered by insurance and can be expensive. Although weight loss medicines may not help you reach your "dream" weight, they can contribute to reducing your risk of diabetes or heart disease.
                        <p>
                          Weight loss medicines may be recommended for people who have not been able to lose weight with diet and exercise who have a:
                          <ul>
                            <li>Body mass index (BMI) of 30 or more.</li>
                            <li>BMI between 27 and 29.9 and have other medical problems, such as diabetes, high cholesterol, or high blood pressure.</li>
                          </ul>
                        </p>
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weightloss_medication_start_date"}
                      value={obesityAssessment?.weightloss_medication_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weightloss_medication_end_date"}
                      value={obesityAssessment?.weightloss_medication_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 2 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on Dietary supplements.</b>
                      <h5>DIETARY SUPPLEMENTS NOT RECOMMENDED</h5>
                      <p>
                        Dietary supplements are widely used by people who are trying to lose weight. However, doctors <b>DO NOT</b> recommend their use because some are unsafe, and other supplements have not been studied carefully and there is no proof that they are safe or effective.
                      </p>
                      <p>
                        Many herbal weight loss medicines are unsafe or do not work. Check with your doctor or pharmacist before you take any herbal weight loss medicines. There is also an over-the-counter (non-prescription) version of a prescription medicine called orlistat (brand name: Alli). It is probably safe to try, but it can cause unwanted side effects, such as cramps, burping, and gas.
                      </p>
                      <p>
                        Some weight loss medicines are sold over the internet. However, they can contain harmful ingredients and be unsafe.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"dietary_supplements_start_date"}
                      value={obesityAssessment?.dietary_supplements_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"dietary_supplements_end_date"}
                      value={obesityAssessment?.dietary_supplements_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate on other weight loss methods.</b>
                      <p>
                        There are medicines and surgery to help with weight loss. But these treatments are only for people who have not been able to lose weight through diet and exercise.
                      </p>
                      <p>
                        Weight loss treatments <b>DO NOT</b> take the place of diet and exercise. People who have those treatments must also change how they eat and how active they are.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weightloss_method_start_date"}
                      value={obesityAssessment?.weightloss_method_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"weightloss_method_end_date"}
                      value={obesityAssessment?.weightloss_method_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 4 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand the importance of seeing a Dietitian.</b>
                      <p>
                        It can also help to work with a dietitian (food expert). They can help you make a diet plan that will be specifically designed for you and your requirements, a plan you can stick to and then you can follow up regularly with the dietitian to evaluate your progress.
                      </p>
                    </p>
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"seeing_dietitian_start_date"}
                      value={obesityAssessment?.seeing_dietitian_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-lg-3 md-3 sm-6">
                    <DatePickerComponent
                      fieldName={"seeing_dietitian_end_date"}
                      value={obesityAssessment?.seeing_dietitian_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Space>
          <Button type="primary" onClick={() => handlePreviousStep?.()}>
            Back
          </Button>
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
export default Obesity;
