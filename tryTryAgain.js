const { Machine, interpret, assign } = require("xstate");

const tryTryAgain = Machine(
  {
    id: "tryTryAgain",
    initial: "idle",
    context: {
      tries: 0,
    },
    states: {
      idle: {
        on: {
          TRY: "trying",
        },
      },
      trying: {
        entry: ["incTries"],
        on: {
          "": [{ target: "success", cond: "triedEnough" }, { target: "idle" }],
        },
      },
      success: {},
    },
  },
  {
    actions: {
      incTries: assign({
        tries: (ctx) => ctx.tries + 1,
      }),
    },
    guards: {
      triedEnough: (ctx) => ctx.tries >= 3,
    },
  }
);

const [node, file, ...actions] = process.argv;

const service = interpret(tryTryAgain).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
