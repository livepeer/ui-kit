import * as Sentry from '@sentry/nextjs';
import { NextPageContext } from 'next';
import NextErrorComponent, { ErrorProps } from 'next/error';

const CustomErrorComponent = (props: ErrorProps) => {
  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
