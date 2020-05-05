const { Machine, interpret, assign } = require("xstate");

const spaceHeater = Machine(
  {
    id: "spaceHeater",
    initial: "poweredOff",
    states: {
      poweredOff: {
        on: {
          TOGGLE_POWER: "poweredOn",
        },
      },
      poweredOn: {
        on: {
          TOGGLE_POWER: "poweredOff",
        },
        type: "parallel",
        states: {
          heated: {
            initial: "lowHeat",
            states: {
              lowHeat: {
                on: {
                  TOGGLE_HEAT: "highHeat",
                },
              },
              highHeat: {
                on: {
                  TOGGLE_HEAT: "lowHeat",
                },
              },
            },
          },
          oscillation: {
            initial: "disabled",
            states: {
              enabled: {
                on: { TOGGLE_OSC: "disabled" },
              },
              disabled: {
                on: { TOGGLE_OSC: "enabled" },
              },
            },
          },
        },
      },
    },
  },
  {}
);

const [node, file, ...actions] = process.argv;

const service = interpret(spaceHeater).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
