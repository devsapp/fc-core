const firstUpperCase = (str: string) =>
  str?.toString().replace(/^( |^)[a-z]/g, (L) => L.toUpperCase());

export const formatterOutput = {
  /**
   * @returns Getting ${type}: ${details}
   * @example Getting domain: todolist.todolist.*****.cn-hangzhou.fc.devsapp.net
  */
  get: (type: string, details: string) => {
    return `Getting ${type}: ${details}`;
  },

  /**
   * @returns Setting ${type}: ${details}
   * @example Setting domain: todolist.todolist.*****.cn-hangzhou.fc.devsapp.net
  */
  set: (type: string, details: string) => {
    return `Setting ${type}: ${details}`;
  },

  /**
   * @returns Creating ${type}: ${details}
   * @example Creating serivce: my-test-service
  */
  create: (type: string, details: string) => {
    return `Creating ${type}: ${details}`;
  },

  /**
   * @returns Updating ${type}: ${details}
   * @example Updating function: my-test-function
  */
  update: (type: string, details: string) => {
    return `Updating ${type}: ${details}`;
  },

  /**
   * @returns Removing ${type}: ${details}
   * @example Removing function: my-test-function
  */
  remove: (type: string, details: string) => {
    return `Removing ${type}: ${details}`;
  },

  /**
   * @returns Reminder ${type}: ${details}${description ? (${description}) \: ""}
   * @example
   * Reminder customDomain: default is auto
   * Reminder deploy type: sdk (Switch command [s cli fc-default set deploy-type pulumi])
  */
  warn: (type: string, details: string, description?: string) => {
    return `Reminder ${type}: ${details}${
      description ? `(${description})` : ""
    }`;
  },

  /**
   * @returns \nTips for next step:${step.map((item) => `\n* ${item}`)}\n
   * @example
   *   Tips for next step:
   *    * Invoke remote function: s invoke
   *    * Remove service: s remove service
   */
  nextStep: (step: string[]) => {
    return `\nTips for next step:${step.map((item) => `\n* ${item}`)}\n`;
  },

  /**
   * @returns Using ${type}: ${details}
   * @example Using region: cn-hangzhou
   */
  using: (type: string, details: string) => {
    return `Using ${type}: ${details}`;
  },

  /**
   * @returns Checking ${firstUpperCase(type)} ${details} exists
   * @example Checking Serivce my-service exists
   */
  check: (type: string, details: string) => {
    return `Checking ${firstUpperCase(type)} ${details} exists`;
  },

  /**
   * @returns Retrying ${type}: ${action} ${details}${times ? `, retry ${times} time` \: ""}
   * @example
   * Retrying function: create myfunction
   * Retrying function: create myfunction, retry 1 time
   */
  retry: (type: string, action: string, details: string, times?: number) => {
    return `Retrying ${type}: ${action} ${details}${
      times ? `, retry ${times} time` : ""
    }`;
  },
};
