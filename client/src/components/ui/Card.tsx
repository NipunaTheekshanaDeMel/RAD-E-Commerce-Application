import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-white shadow-sm',
          hoverable && 'transition-shadow hover:shadow-md',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      ref={ref}
      {...props}
    />
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      ref={ref}
      {...props}
    />
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      className={cn('text-sm text-gray-500', className)}
      ref={ref}
      {...props}
    />
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn('p-6 pt-0', className)} ref={ref} {...props} />
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      ref={ref}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };