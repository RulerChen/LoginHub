import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BsGoogle, BsGithub } from 'react-icons/bs';
import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';

import axios from '../utils/axios';
import AuthSocialButton from './AuthSocialButton';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmed_password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (variant === 'LOGIN') {
      axios
        .post(`/v1/gateway/auth/signin`, data, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success('Login successfully');
          }
        })
        .catch(() => {
          toast.error('Login failed');
        })
        .finally(() => reset());
    }
    if (variant === 'REGISTER') {
      if (data.password !== data.confirmed_password) {
        toast.error('Password not match');
        return;
      }
      axios
        .post(`/v1/gateway/auth/signup`, data)
        .then((res) => {
          if (res.status === 201) {
            toast.success('Register successfully');
            setVariant('LOGIN');
          }
        })
        .catch(() => {
          toast.error('Register failed');
        });
    }
  };

  const socialAction = (action: string) => {
    // switch (action) {
    //   case 'google':
    //     window.location.href = `${url}/user/google`;
    //     break;
    //   case 'github':
    //     window.location.href = `${url}/user/github`;
    //     break;
    //   default:
    //     break;
    // }
    console.log(action);
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              isDisabled={isSubmitting}
              id="username"
              label="Username"
              variant="faded"
              classNames={{
                label: 'dark:text-black/90 dark:group-data-[focus=true]:text-black/90',
                input: ['dark:text-black'],
                inputWrapper: ['dark:bg-gray-100'],
              }}
              isInvalid={!!errors.username}
              errorMessage="Please enter a valid username"
              {...register('username')}
            />
          )}
          <Input
            isDisabled={isSubmitting}
            id="email"
            label="Email"
            type="email"
            variant="faded"
            classNames={{
              label: 'dark:text-black/90 dark:group-data-[focus=true]:text-black/90',
              input: ['dark:text-black'],
              inputWrapper: ['dark:bg-gray-100'],
            }}
            isInvalid={!!errors.email}
            errorMessage="Please enter a valid email"
            {...register('email')}
          />
          <Input
            isDisabled={isSubmitting}
            id="password"
            label="Password"
            type="password"
            variant="faded"
            classNames={{
              label: 'dark:text-black/90 dark:group-data-[focus=true]:text-black/90',
              input: ['dark:text-black'],
              inputWrapper: ['dark:bg-gray-100'],
            }}
            isInvalid={!!errors.password}
            errorMessage="Please enter a valid password"
            {...register('password')}
          />
          {variant === 'REGISTER' && (
            <Input
              isDisabled={isSubmitting}
              id="confirmed_password"
              label="Confirm Password"
              type="password"
              variant="faded"
              classNames={{
                label: 'dark:text-black/90 dark:group-data-[focus=true]:text-black/90',
                input: ['dark:text-black'],
                inputWrapper: ['dark:bg-gray-100'],
              }}
              isInvalid={!!errors.confirmed_password}
              errorMessage="Please enter a valid confirmed password"
              {...register('confirmed_password')}
            />
          )}
          <div>
            <Button className="w-full" isLoading={isSubmitting} type="submit" variant="solid">
              {variant === 'LOGIN' ? 'Login' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>{variant === 'LOGIN' ? 'New to LoginHub?' : 'Already have an account?'}</div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
