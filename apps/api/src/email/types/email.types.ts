export type EmailJobName =
  | 'sendActivation'
  | 'sendPasswordReset'
  | 'sendProjectInvitation';

export type EmailJobData = {
  sendActivation: { email: string; token: string; lifetime: string };
  sendPasswordReset: { email: string; token: string; lifetime: string };
  sendProjectInvitation: {
    email: string;
    token: string;
    projectName: string;
    expiresAt: Date;
  };
};
