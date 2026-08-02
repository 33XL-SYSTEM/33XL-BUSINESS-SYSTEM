import { Widget, Connection } from '../data/store';

export interface Cluster {
  id: string; // ID of the root widget
  widgets: Widget[];
}

export function getClusters(widgets: Widget[], connections: Connection[]): Cluster[] {
  const adjList = new Map<string, string[]>();
  
  // Initialize adjList
  widgets.forEach(w => adjList.set(w.id, []));

  // Build undirected graph
  connections.forEach(c => {
    if (adjList.has(c.source) && adjList.has(c.target)) {
      adjList.get(c.source)!.push(c.target);
      adjList.get(c.target)!.push(c.source);
    }
  });

  const visited = new Set<string>();
  const clusters: Cluster[] = [];

  for (const widget of widgets) {
    if (!visited.has(widget.id)) {
      const clusterWidgets: Widget[] = [];
      const queue = [widget.id];
      visited.add(widget.id);

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const currentWidget = widgets.find(w => w.id === currentId);
        if (currentWidget) {
          clusterWidgets.push(currentWidget);
        }

        const neighbors = adjList.get(currentId) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }

      clusters.push({
        id: widget.id, // The first visited widget becomes the root
        widgets: clusterWidgets
      });
    }
  }

  return clusters;
}
