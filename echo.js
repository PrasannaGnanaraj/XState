const { Machine, interpret, assign, send } = require("xstate");

const echoCallBackHandler = (context, event) => (callback, onEvent) => {
  onEvent((e) => {
    if (e.type === "HEAR") callback("ECHO");
  });
};

const echo = Machine(
  {
    id: "echo",
    initial: "listening",
    states: {
      listening: {
        invoke: {
          id: "echoCallback",
          src: echoCallBackHandler,
        },
        on: {
          SPEAK: {
            actions: send("HEAR", {
              to: "echoCallback",
            }),
          },
          ECHO: {
            actions: () => {
              console.log("echo");
            },
          },
        },
      },
    },
  },
  {}
);

const [node, file, ...actions] = process.argv;

const service = interpret(echo).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
