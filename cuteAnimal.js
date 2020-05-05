const { Machine, interpret, assign } = require("xstate");
const https = require("https");
const get = (url) =>
  new Promise((resolve, reject) =>
    https.get(url, (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", (data) => (body += data));
      return res.on("end", () => {
        body = JSON.parse(body);
        return resolve(body);
      });
    })
  );
const fetchAnimals = (url) => {
  return get("https://www.reddit.com/r/aww.json").then((data) =>
    data.data.children.map((child) => child.data)
  );
};

const cuteAnimals = Machine(
  {
    id: "cuteAnimals",
    initial: "idle",
    context: {
      cuteAnimals: null,
      error: null,
    },
    states: {
      idle: {
        on: { FETCH: "loading" },
      },
      loading: {
        invoke: {
          id: "fetchAnimals",
          src: fetchAnimals,
          onDone: {
            target: "success",
            actions: assign({
              cuteAnimals: (context, event) => event.data,
            }),
          },
          onError: {
            target: "failure",
            actions: assign({
              error: (context, event) => event.data,
            }),
          },
        },
      },
      success: {
        type: "final",
      },
      failure: {
        on: { RETRY: "loading" },
      },
    },
  },
  {}
);

const [node, file, ...actions] = process.argv;

const service = interpret(cuteAnimals).start();

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.value);
  }
});

actions.forEach((action) => service.send(action));
