export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { schedule } = await import('node-cron');
    schedule('0 * * * * *', () => {
      console.log('A minute has passed.');
    });
  }
}
