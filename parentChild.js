const { Machine, interpret, assign, send } = require("xstate");

const child = Machine(
  {
    id: "child",
    initial: "step1",
    states: {
      step1: { on: { STEP: "step2" } },
      step2: { on: { STEP: "step3" } },
      step3: {
        type: "final",
      },
    },
  },
  {}
);

const parent = Machine(
  {
    id: "parent",
    initial: "idle",
    states: {
      idle: {
        on: {
          ACTIVATE: "active",
        },
      },
      active: {
        invoke: {
          id: "child",
          src: child,
          onDone: "done",
        },
        on: {
          STEP: {
            actions: send("STEP", {
              to: "child",
            }),
          },
        },
      },
      done: {},
    },
  },
  {}
);
const [node, file, ...actions] = process.argv;
const [childService, parentService] = [
  interpret(child).start(),
  interpret(parent).start(),
];

childService.onTransition((state) => {
  if (state.changed) {
    console.log(state.value, 'child');
  }
});
parentService.onTransition((state) => {
  if (state.changed) {
    console.log(state.value,'parent');
  }
});

actions.forEach((action) => parentService.send(action));
