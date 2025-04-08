import {ActiveParamsType} from "../../../types/active-params.type";
import {CONSTANTS} from "../../../types/constants";
import {Params} from "@angular/router";

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = {types: []};

    if (params.hasOwnProperty('types')) {
      activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
    }
    if (params.hasOwnProperty(CONSTANTS.heightTo)) {
      activeParams.heightTo = params[CONSTANTS.heightTo];
    }
    if (params.hasOwnProperty(CONSTANTS.heightFrom)) {
      activeParams.heightFrom = params[CONSTANTS.heightFrom];
    }
    if (params.hasOwnProperty(CONSTANTS.diameterFrom)) {
      activeParams.diameterFrom = params[CONSTANTS.diameterFrom];
    }
    if (params.hasOwnProperty(CONSTANTS.diameterTo)) {
      activeParams.diameterTo = params[CONSTANTS.diameterTo];
    }
    if (params.hasOwnProperty('sort')) {
      activeParams.sort = params['sort'];
    }
    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }
    return activeParams;
  }
}
