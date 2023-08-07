import axios from "@/utils/axios";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import qs from "qs";

//
export function useSupervisors() {
  return useQuery(["supervisors"], async () => {
    const response = await axios.get(
      "/organization/supervisors/?page_size=1000"
    );
    return response.data.results;
  });
}
export function useTeams() {
  return useQuery(["teams"], async () => {
    const response = await axios.get("/organization/teams/?page_size=1000");
    return response.data.results;
  });
}
export function useLocations() {
  return useQuery(["location"], async () => {
    const response = await axios.get(
      "/organization/work-locations/?page_size=1000"
    );
    return response.data.results;
  });
}
export function useDepartments() {
  return useQuery(["departments"], async () => {
    const response = await axios.get(
      "/organization/departments/?page_size=1000"
    );
    return response.data.results;
  });
}
export function useRegions() {
  return useQuery(["regions"], async () => {
    const response = await axios.get("/organization/regions/?page_size=1000");
    return response.data.results;
  });
}
export function useTiers() {
  return useQuery(["tiers"], async () => {
    const response = await axios.get("/organization/tiers/?page_size=1000");
    return response.data.results;
  });
}
export function usePayGroups() {
  return useQuery(["payGroups"], async () => {
    const response = await axios.get(
      "/organization/pay-groups/?page_size=1000"
    );
    return response.data.results;
  });
}
export function useAreas() {
  return useQuery(["areas"], async () => {
    const response = await axios.get("/organization/areas/?page_size=1000");
    return response.data.results;
  });
}
export function useJobDescriptions() {
  return useQuery(["jobDescriptions"], async () => {
    const response = await axios.get(
      "/organization/job-descriptions/?page_size=1000"
    );
    return response.data.results;
  });
}

//

export function useDetailedPositions(
  positionIds,
  departmentIds,
  teamIds,
  locationIds
) {

  return useQuery(
    ["detailed_positions", positionIds, departmentIds, teamIds, locationIds],
    async () =>
      axios.get("/organization/positions/detailed/", {
        params: {
          position: unref(positionIds).join(","),
          department: unref(departmentIds).join(","),
          team: unref(teamIds).join(","),
          location: unref(locationIds).join(","),
        },
        paramsSerializer: function (params) {
          return qs.stringify(params, { encode: false });
        },
      }),
    {
      select(response) {
        return {
          positions: response.data.results,
          details: response.data.results,
          // .flatMap((position) =>
          //   position.details.map((detail) => ({
          //     ...detail,
          //     position_name: position.position_name,
          //     job_description: position.job_description,
          //     position_id: position.id,
          //   }))
          // )
        };
      },
    }
  );
}
