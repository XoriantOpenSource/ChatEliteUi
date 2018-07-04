
function requireAll(r) {
    r.keys().forEach(r);
}

window.__collab_config = {};

// register all the controllers for the application
requireAll(require.context("./src/ts", true, /.test.js/));
