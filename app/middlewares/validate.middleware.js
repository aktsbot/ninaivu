export const validate = (schema, isJSON) => (req, res, next) => {
  const { value, error } = schema.validate({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (error) {
    return next({
      status: 400,
      message: "Payload validation errors",
      errors: [error],
      isJSON,
    });
  }

  if (value) {
    req.xop = { ...value };
  }

  next();
};

// this middleware is called when a page submission happens,
// for example a POST request from user signup page.
export const validatePageSubmission =
  ({ schema, routeMeta, goBackOnError }) =>
  (req, res, next) => {
    /*
     * routeMeta => { template, meta: { title } }
     */

    const { value, error } = schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (error) {
      req.flash("error", [error]);

      if (goBackOnError) {
        const backURL = req.header("referer");

        if (backURL) {
          res.redirect(backURL);
          return;
        }
      }

      return res.render(routeMeta.template, {
        title: routeMeta.meta.title,
        flashes: req.flash(),
        body: req.body,
        query: req.query,
        params: req.params,
      });
    }

    if (value) {
      req.xop = { ...value };
    }

    next();
  };
