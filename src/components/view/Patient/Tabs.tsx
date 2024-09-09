/* eslint-disable @typescript-eslint/no-use-before-define */

import React, { useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import useDynTabs from "react-dyn-tabs";
import { PatientType } from "@/Types/PatientType";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import Profile from "./Profile";
import Patients from "./Patients";
import { getPatientList } from "../../../actions/Patients/PatientActions";
import { useDispatch } from "react-redux";
import { addPatientProfileData } from "../../../store/reducer/QuestionairesReducer";
import { useLocation } from "react-router-dom";

export default function TABS() {

  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.patientId;

  useEffect(() => {
    if (id) {
      getPatientList("", 1, "", "", false, id, "", 0, "")
        .then(({ data: response }) => {
          if (response.success) {

            const data = response.data;

            const filter = data.filter(
              (items: any) => items.id === id
            );

            openNewTab(filter[0], response.programs_list, response.coordinators);
            dispatch(
              addPatientProfileData({
                programmId: "",
                patient: {} as PatientType,
              })
            );
          }
        })
        .catch((err) => {
          console.log("error is ", err);
        });
    }
  }, [id]);

  const openNewTab = async (id: any, program?: any, coordinators?: any) => {
    _instance
      .open({
        id: id.id,
        title: id?.name,
        lazy: true,
        panelComponent: function PanelComponent() {
          return <Profile Patient={id} program={program} coordinators={coordinators} />;
        },
      })
      .then(await _instance.select(id.id));
  };
  // define options
  const options = {
    tabs: [
      {
        id: "0",
        title: "Patients",
        panelComponent: <Patients openTab={openNewTab} />,
        closable: false,
      },
    ],
    selectedTabID: "0",
  };

  const [Tablist, Panellist, ready] = useDynTabs(options);
  let _instance: {
    isSelected: (arg0: string) => ((value: any) => any) | null | undefined;
    getOption: (arg0: string) => string;
    open: (arg0: {
      id: string;
      title: string;
      lazy: boolean;
      panelComponent: () => JSX.Element;
    }) => Promise<any>;
    setOption: (
      arg0: string,
      arg1: string | boolean
    ) => { (): any; new(): any; refresh: { (): void; new(): any } };
    isOpen: (arg0: string) => any;
    select: (arg0: any) => Promise<any>;
    setTab: (
      arg0: any,
      arg1: { disable: boolean }
    ) => { (): any; new(): any; refresh: { (): void; new(): any } };
    getData: () => { (): any; new(): any; selectedTabID: any };
    close: (arg0: any) => void;
  };

  ready(
    (instance: {
      isSelected: (arg0: string) => ((value: any) => any) | null | undefined;

      getOption: (arg0: string) => string;
      open: (arg0: {
        id: string;
        title: string;
        lazy: boolean;
        panelComponent: () => JSX.Element;
      }) => Promise<any>;
      setOption: (
        arg0: string,
        arg1: string | boolean
      ) => { (): any; new(): any; refresh: { (): void; new(): any } };
      isOpen: (arg0: string) => any;
      select: (arg0: any) => Promise<any>;
      setTab: (
        arg0: any,
        arg1: { disable: boolean }
      ) => { (): any; new(): any; refresh: { (): void; new(): any } };
      getData: () => { (): any; new(): any; selectedTabID: any };
      close: (arg0: any) => void;
    }) => {
      _instance = instance;
    }
  );

  return (
    <div>
      <div>
        <Tablist />
        <Panellist />
      </div>
    </div>
  );
}
