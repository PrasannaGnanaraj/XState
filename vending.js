const { Machine, interpret, assign } = require("xstate");

const vendingMachine = Machine(
  {
    id: "vendingMachine",
    initial: "idle",
    context: {
      deposited: 0,
    },
    states: {
      idle: {
        on: {
          SELECT_ITEM: {
            target: "vending",
            cond: "depositedEnough",
          },
          DEPOSIT_QUARTER: {
            target: "idle",
            actions: ["addQuarter"],
          },
        },
      },
      vending: {},
    },
  },
  {
    actions: {
      addQuarter: assign({
        deposited: (context) => context.deposited + 25,
      }),
    },
    guards: {
      depositedEnough: (context) => context.deposited >= 100,
    },
  }
);

const [node, file, ...actions] = process.argv;

const service = interpret(vendingMachine).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
