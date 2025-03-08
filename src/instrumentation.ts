export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { schedule } = await import('node-cron');
    schedule('* */1 * * * *', () => {
      console.log('A minute has passed.');
    });
  }
}
