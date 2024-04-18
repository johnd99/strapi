import { Flex, IconButton, Typography } from '@strapi/design-system';
import { CarretDown, Drag, Trash } from '@strapi/icons';
import styled from 'styled-components';

interface ComponentDragPreviewProps {
  displayedValue: string;
}

const ComponentDragPreview = ({ displayedValue }: ComponentDragPreviewProps) => {
  return (
    <Flex
      background="neutral0"
      borderColor="neutral200"
      justifyContent="space-between"
      gap={3}
      padding={3}
      width="30rem"
    >
      <ToggleButton type="button">
        <Flex gap={6}>
          <DropdownIconWrapper
            alignItems="center"
            justifyContent="center"
            background="neutral200"
            height="3.2rem"
            width="3.2rem"
          >
            <CarretDown />
          </DropdownIconWrapper>

          <Flex maxWidth="15rem">
            <Typography textColor="neutral700" ellipsis>
              {displayedValue}
            </Typography>
          </Flex>
        </Flex>
      </ToggleButton>

      <Flex gap={2}>
        <IconButton aria-label="" borderWidth={0}>
          <Trash />
        </IconButton>

        <IconButton aria-label="" borderWidth={0}>
          <Drag />
        </IconButton>
      </Flex>
    </Flex>
  );
};

const DropdownIconWrapper = styled(Flex)`
  border-radius: 50%;

  svg {
    height: 0.6rem;
    width: 1.1rem;
    > path {
      fill: ${({ theme }) => theme.colors.neutral600};
    }
  }
`;

// TODO: we shouldn't have to reset a whole button
const ToggleButton = styled.button`
  border: none;
  background: transparent;
  display: block;
  width: 100%;
  text-align: unset;
  padding: 0;
`;

export { ComponentDragPreview };
export type { ComponentDragPreviewProps };
