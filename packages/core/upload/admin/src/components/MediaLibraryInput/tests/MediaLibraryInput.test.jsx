import React from 'react';

import { Form } from '@strapi/admin/strapi-admin';
import { screen, render } from '@tests/utils';

import { MediaLibraryInput } from '../index';

describe('<MediaLibraryInput />', () => {
  it('renders and matches the snapshot', () => {
    render(<MediaLibraryInput name="test" label="default message" required />, {
      renderOptions: {
        wrapper: ({ children }) => (
          <Form onSubmit={jest.fn()} method="POST">
            {children}
          </Form>
        ),
      },
    });

    expect(screen.getByRole('button')).toMatchInlineSnapshot(`
      .c0 {
        width: 100%;
        height: 100%;
      }

      .c2 {
        color: #4945ff;
        margin-bottom: 12px;
        width: 30px;
        height: 24px;
      }

      .c1 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .c4 {
        font-size: 1.2rem;
        line-height: 1.33;
        font-weight: 600;
        color: #666687;
      }

      .c3 path {
        fill: #4945ff;
      }

      .c5 {
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }

      <button
        class="c0 c1"
        style="cursor: pointer;"
        type="button"
      >
        <svg
          aria-hidden="true"
          class="c2 c3"
          fill="none"
          height="1rem"
          viewBox="0 0 24 20"
          width="1rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.569 2.398H7.829v1.586h13.74c.47 0 .826.5.826 1.094v9.853l-2.791-3.17a2.1 2.1 0 0 0-.74-.55 2.2 2.2 0 0 0-.912-.196 2.2 2.2 0 0 0-.912.191 2.1 2.1 0 0 0-.74.546l-2.93 3.385-2.973-3.36a2.15 2.15 0 0 0-.741-.545 2.228 2.228 0 0 0-1.824.007c-.286.13-.538.319-.739.553l-2.931 3.432V7.653H2.51v9.894q.035.23.108.452v.127l.041.095q.086.213.207.412l.099.15q.111.16.247.302l.124.119q.196.178.43.309h.024c.36.214.775.327 1.198.325h16.515c.36-.004.716-.085 1.039-.24.323-.153.606-.375.827-.648a2.8 2.8 0 0 0 .504-.888q.1-.326.124-.666V5.078a2.5 2.5 0 0 0-.652-1.81 2.7 2.7 0 0 0-1.776-.87"
            fill="#32324D"
          />
          <path
            d="M12.552 9.199c.912 0 1.651-.71 1.651-1.585 0-.876-.74-1.586-1.651-1.586-.912 0-1.652.71-1.652 1.586 0 .875.74 1.585 1.652 1.585M3.303 6.408h.826V3.997h2.477V2.41H4.129V0h-.826c-.219 0-.85.002-.826 0v2.411H0v1.586h2.477v2.41z"
            fill="#32324D"
          />
        </svg>
        <span
          class="c4 c5"
          style="text-align: center;"
        >
          Click to add an asset or drag and drop one in this area
        </span>
      </button>
    `);
  });
});
