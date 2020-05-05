const { Machine, interpret, assign } = require("xstate");

const door = Machine(
  {
    id: "door",
    initial: "locked",
    states: {
      locked: {
        id: "locked",
        on: {
          UNLOCK: "unlocked",
        },
      },
      unlocked: {
        initial: "closed",
        states: {
          closed: {
            on: {
              LOCK: "#locked",
              OPEN: "opened",
            },
          },
          opened: {
            on: {
              CLOSE: "closed",
            },
          },
        },
      },
    },
  },
  {}
);

const [node, file, ...actions] = process.argv;

const service = interpret(door).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
