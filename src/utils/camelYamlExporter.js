import yaml from "js-yaml";

/*
Convert workflow graph → Camel YAML DSL
*/
export function workflowToCamelYAML(workflow) {
  const { nodes, edges } = workflow;

  if (!nodes.length) return "";

  // -------- find start node --------
  const startNode =
    nodes.find((n) => n.type === "start") || nodes[0];

  // -------- build adjacency map --------
  const nextMap = {};

  edges.forEach((e) => {
    if (!nextMap[e.source]) nextMap[e.source] = [];
    nextMap[e.source].push(e.target);
  });

  // -------- traverse nodes --------
  const steps = [];
  let current = startNode.id;
  const visited = new Set();

  while (current && !visited.has(current)) {
    visited.add(current);

    const node = nodes.find((n) => n.id === current);

    if (!node) break;

    const camelStep = mapNodeToCamelStep(node);

    if (camelStep) steps.push(camelStep);

    current = nextMap[current]?.[0];
  }

  // -------- build camel route --------
  const camelRoutes = [
    {
      route: {
        id: "generated-route",
        from: {
          uri: getFromUri(startNode),
          steps,
        },
      },
    },
  ];

  return yaml.dump(camelRoutes, { noRefs: true });
}

/*
Map node type → Camel processor
*/
function mapNodeToCamelStep(node) {
  switch (node.type) {
    case "log":
      return { to: `log:${node.data?.message || "info"}` };

    case "http":
      return { to: node.data?.url };

    case "transform":
      return {
        setBody: {
          constant: node.data?.value,
        },
      };

    case "choice":
      return {
        choice: {
          when: node.data?.conditions || [],
        },
      };

    case "to":
      return { to: node.data?.uri };

    default:
      return null;
  }
}

/*
Get starting endpoint
*/
function getFromUri(node) {
  return node?.data?.uri || "direct:start";
}