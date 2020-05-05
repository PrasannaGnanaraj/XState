const { Machine, interpret, assign } = require("xstate");

const alarmMachine = Machine(
  {
    id: "alarmClock",
    initial: "idle",
    states: {
      idle: {
        on: {
          ALARM: "alarming",
        },
      },
      alarming: {
        activities: ["beeping"],
        on: {
          STOP: "idle",
        },
      },
    },
  },
  {
    activities: {
      beeping: (context, event) => {
        const beep = () => {
          console.log("beep");
        };
        beep();
        const intervalId = setInterval(beep, 1000);

        return () => {
          clearInterval(intervalId);
          console.log("clearing");
        };
      },
    },
  }
);

const [node, file, ...actions] = process.argv;

const service = interpret(alarmMachine).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
