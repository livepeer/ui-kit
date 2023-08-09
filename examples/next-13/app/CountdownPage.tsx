'use client';

import Countdown from 'react-countdown';

interface Props {
  poster: string;
  countdown: Date;
}

interface CountdownProps {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export default ({ poster, countdown }: Props) => {
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const formattedDate = formatDate(countdown);

  return (
    <section
      style={{
        backgroundImage: `url(${poster})`,
        backgroundPosition: 'center',
        display: 'flex',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        position: 'relative',
      }}
    >
      <div
        style={{
          background: 'rgba(1,1,1,0.5)',
          color: '#ffffff',
          bottom: '0',
          left: '0',
          position: 'absolute',
          margin: '20px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          fontSize: '1.2em',
          width: '19rem',
          borderRadius: '10px',
        }}
      >
        {clockIcon()}
        <div
          style={{
            marginLeft: '1em',
            marginTop: '1em',
          }}
        >
          <Countdown date={countdown} renderer={renderer} />
          <p
            style={{
              marginTop: '0.5em',
            }}
          >
            {formattedDate}
          </p>
        </div>
      </div>
    </section>
  );
};

const renderer = ({ hours, minutes, seconds, completed }: CountdownProps) => {
  if (completed) {
    window.location.reload();
  } else {
    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(
          seconds,
        ).padStart(2, '0')}`
      : minutes > 0
      ? `${minutes}:${String(seconds).padStart(2, '0')}`
      : `${seconds}`;
  }
};

const clockIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    style={{
      marginLeft: '1rem',
    }}
    height="2em"
    width="2em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
    <path d="M13 7h-2v6h6v-2h-4z"></path>
  </svg>
);
