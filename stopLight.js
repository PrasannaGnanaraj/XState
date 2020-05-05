const { Machine, interpret, assign } = require("xstate");

const stoplight = Machine(
  {
    id: "stoplight",
    initial: "red",
    context: {
      rushHourMultiplier: 0,
    },
    on: {
      INC_RUSH_HOUR: {
        actions: ["incRushHour"],
      },
    },
    states: {
      green: {
        after: {
          YELLOW_TIMER: "yellow",
        },
      },
      yellow: {
        after: {
          RED_TIMER: "red",
        },
      },
      red: {
        after: {
          GREEN_TIMER: "green",
        },
      },
    },
  },
  {
    actions: {
      incRushHour: assign({
        rushHourMultiplier: (ctx) => ctx.rushHourMultiplier + 1,
      }),
    },
    delays: {
      GREEN_TIMER: (ctx) => ctx.rushHourMultiplier * 3000,
      YELLOW_TIMER: (ctx) => ctx.rushHourMultiplier * 2000,
      RED_TIMER: (ctx) => ctx.rushHourMultiplier * 4000,
    },
  }
);

const [node, file, ...actions] = process.argv;

const service = interpret(stoplight).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
