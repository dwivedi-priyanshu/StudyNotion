mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4  // force IPv4, sometimes fixes Render DNS issues
})
.then(() => console.log("Db connection established"))
.catch((err) => {
    console.error("Db connection Failed", err);
    process.exit(1);
});
