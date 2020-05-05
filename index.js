const { Machine, interpret, assign } = require("xstate");
const lit = {
  exit: (context, event) => {
    console.log("My life is so dark now");
  },
  on: {
    BREAK: {
      target: "broken",
    },
    TOGGLE: "unlit",
    CHANGE_COLOR: {
      actions: assign({
        color: "#000",
      }),
    },
  },
};
const unlit = {
  on: {
    BREAK: {
      target: "broken",
    },
    TOGGLE: "lit",
    CHANGE_COLOR: {
      actions: ["changeColor"],
    },
  },
};
const broken = {
  entry: ["logBroken"],
  type: "final",
};

const states = { lit, unlit, broken };

const initial = "unlit";

const config = {
  id: "lightBulb",
  initial,
  states,
  context: {
    color: "#fff",
  },
};

const lightBulbMachine = Machine(config, {
  actions: {
    logBroken(context, event) {
      console.log(`Im broke at ${event.location}`);
    },
    changeColor: assign((context, event) => {
      return "#fff";
    }),
  },
});

const [node, file, ...actions] = process.argv;

const service = interpret(lightBulbMachine).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value, state.context.color);
  }
});

actions.forEach((action) => service.send(action));
