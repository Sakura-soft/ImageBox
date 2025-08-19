const parseEnvTime = (timeStr) => {
  const value = parseInt(timeStr);
  if (timeStr.endsWith('d')) return value * 24 * 60 * 60 * 1000;
  if (timeStr.endsWith('h')) return value * 60 * 60 * 1000;
  if (timeStr.endsWith('m')) return value * 60 * 1000;
  return value * 1000;
};

export const cookieOption = () => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: parseEnvTime(process.env.TOKEN_EXPIRY),
  };
};
