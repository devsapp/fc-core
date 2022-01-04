const firstUpperCase = (str: string) =>
  str?.toString().replace(/^( |^)[a-z]/g, (L) => L.toUpperCase());

export const formatterOutput = {
  get: (type: string, details: string) => {
    // E.g.: Getting domain: todolist.todolist.*****.cn-hangzhou.fc.devsapp.net
    return `Getting ${type}: ${details}`;
  },

  set: (type: string, details: string) => {
    // E.g.: Setting domain: todolist.todolist.*****.cn-hangzhou.fc.devsapp.net
    return `Setting ${type}: ${details}`;
  },

  create: (type: string, details: string) => {
    // E.g.: Creating serivce: my-test-service
    return `Creating ${type}: ${details}`;
  },

  update: (type: string, details: string) => {
    // E.g.: Updating function: my-test-function
    return `Updating ${type}: ${details}`;
  },

  remove: (type: string, details: string) => {
    // E.g.: Removing function: my-test-function
    return `Removing ${type}: ${details}`;
  },

  warn: (type: string, details: string, description?: string) => {
    // E.g.:
    // Reminder customDomain: default is auto
    // Reminder deploy type: sdk (Switch command [s cli fc-default set deploy-type pulumi])
    return `Reminder ${type}: ${details}${
      description ? `(${description})` : ""
    }`;
  },

  nextStep: (step: string[]) => {
    // E.g.:
    //   Tips for next step:
    //     * Invoke remote function: s invoke
    //     * Remove service: s remove service
    return `\nTips for next step:${step.map((item) => `\n* ${item}`)}\n`;
  },

  using: (type: string, details: string) => {
    // E.g.: Using region: cn-hangzhou
    return `Using ${type}: ${details}`;
  },

  check: (type: string, details: string) => {
    // E.g.: Checking Serivce my-service exists
    return `Checking ${firstUpperCase(type)} ${details} exists`;
  },

  retry: (type: string, action: string, details: string, times?: number) => {
    // E.g.:
    // Retrying function: create myfunction
    // Retrying function: create myfunction, retry 1 time
    return `Retrying ${type}: ${action} ${details}${
      times ? `, retry ${times} time` : ""
    }`;
  },
};
