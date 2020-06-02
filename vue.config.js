module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath:
    //process.env.NODE_ENV === "production" ? "/Prototypes/FSAModification" : "/"
    process.env.NODE_ENV === "production" ? "/web_projects/MEDashboards/" : "/"
};
