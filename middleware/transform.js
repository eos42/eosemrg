module.exports = async (ctx, next) => {
  ctx.props = {
    session: ctx.session,
    body: ctx.request.body.fields
      ? ({...ctx.request.query, ...ctx.request.body.files, ...ctx.request.body.fields})
      : ({...ctx.request.query, ...ctx.request.body, ...ctx.request.body.fields}),
    files: {...ctx.request.body.files},
    path: ctx.path
  }

  await next()
}