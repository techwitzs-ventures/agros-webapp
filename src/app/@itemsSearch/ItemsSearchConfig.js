import ClickAwayListener from '@mui/material/ClickAwayListener';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import clsx from 'clsx';
import _ from '@lodash';
import { memo, useEffect, useReducer, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import withRouter from '@fuse/core/withRouter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const Root = styled('div')(({ theme }) => ({
  '& .ItemsSearchConfig-container': {
    position: 'relative',
  },

  '& .ItemsSearchConfig-suggestionsContainerOpen': {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(),
    left: 0,
    right: 0,
  },

  '& .ItemsSearchConfig-suggestion': {
    display: 'block',
  },

  '& .ItemsSearchConfig-suggestionsList': {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },

  '& .ItemsSearchConfig-input': {
    transition: theme.transitions.create(['background-color'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short,
    }),
    '&:focus': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));

function renderInputComponent(inputProps) {
  const { variant, inputRef = () => { }, ref, ...other } = inputProps;
  return (
    <div className="w-full relative">
      {variant === 'basic' ? (
        // Outlined
        <>
          <TextField
            fullWidth
            InputProps={{
              inputRef: (node) => {
                ref(node);
                inputRef(node);
              },
              classes: {
                input: 'ItemsSearchConfig-input py-0 px-16 h-40 md:h-48 ltr:pr-48 rtl:pl-48',
                notchedOutline: 'rounded-8',
              },
            }}
            variant="outlined"
            {...other}
          />
          <FuseSvgIcon
            className="absolute top-0 ltr:right-0 rtl:left-0 h-40 md:h-48 w-48 p-12 pointer-events-none"
            color="action"
          >
            heroicons-outline:search
          </FuseSvgIcon>
        </>
      ) : (
        // Standard
        <TextField
          fullWidth
          InputProps={{
            disableUnderline: true,
            inputRef: (node) => {
              ref(node);
              inputRef(node);
            },
            classes: {
              input: 'ItemsSearchConfig-input py-0 px-16 h-48 md:h-64',
            },
          }}
          variant="standard"
          {...other}
        />
      )}
    </div>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.item_name, query);
  const parts = parse(suggestion.item_name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <ListItemIcon className="w-52 px-4 md:px-0">
        {suggestion.images.length > 0 && suggestion.featuredImageId ? (
          <img
            className="w-full block rounded"
            src={_.find(suggestion.images, { id: suggestion.featuredImageId }).url}
            alt={suggestion.item_name}
          />
        ) : (
          <img
            className="w-full block rounded"
            src="assets/images/apps/ecommerce/product-image-placeholder.png"
            alt={suggestion.item_name}
          />
        )}
      </ListItemIcon>
      <ListItemText
        className='ml-4'
        primary={parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 600 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )
        )}
      />
    </MenuItem>
  );
}

function getSuggestions(value, data) {
  const inputValue = _.deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : data.filter((suggestion) => {
      const keep = count < 10 && match(suggestion.item_name, inputValue).length > 0;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

function getSuggestionValue(suggestion) {
  return suggestion.item_name;
}

const initialState = {
  searchText: '',
  search: false,
  navigation: null,
  suggestions: [],
  noSuggestions: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'open': {
      return {
        ...state,
        opened: true,
      };
    }
    case 'close': {
      return {
        ...state,
        opened: false,
        searchText: '',
      };
    }
    case 'setSearchText': {
      return {
        ...state,
        searchText: action.value,
      };
    }
    case 'setNavigation': {
      return {
        ...state,
        navigation: action.value,
      };
    }
    case 'updateSuggestions': {
      const suggestions = getSuggestions(action.value, state.navigation);
      const isInputBlank = action.value.trim() === '';
      const noSuggestions = !isInputBlank && suggestions.length === 0;

      return {
        ...state,
        suggestions,
        noSuggestions,
      };
    }
    case 'clearSuggestions': {
      console.log("all suggestions are cleared")
      return {
        ...state,
        suggestions: [],
      };
    }
    case 'setNoSuggestions': {
      console.log("no suggestions set to false")
      return {
        ...state,
        noSuggestions: false
      }
    }
    case 'decrement': {
      return { count: state.count - 1 };
    }
    default: {
      throw new Error();
    }
  }
}

function ItemsSearchConfig(props) {
  const { navigation } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const suggestionsNode = useRef(null);
  const popperNode = useRef(null);
  const buttonNode = useRef(null);

  useEffect(() => {
    dispatch({
      type: 'setNavigation',
      value: navigation,
    });
  }, [navigation]);

  function showSearch(ev) {
    ev.stopPropagation();
    dispatch({ type: 'open' });
    document.addEventListener('keydown', escFunction, false);
  }

  function hideSearch() {
    dispatch({ type: 'close' });
    document.removeEventListener('keydown', escFunction, false);
  }

  function escFunction(event) {
    if (event.keyCode === 27) {
      hideSearch();
    }
  }

  function handleSuggestionsFetchRequested({ value }) {
    dispatch({
      type: 'updateSuggestions',
      value,
    });
  }

  function handleSuggestionSelected(event, { suggestion }) {
    event.preventDefault();
    event.stopPropagation();
    if (!suggestion.item_id) {
      return;
    }
    props.navigate(`/apps/inventory/itemswishlist/new/${suggestion.item_id}`);
    hideSearch();
  }

  function handleSuggestionsClearRequested() {
    dispatch({
      type: 'clearSuggestions',
    });
  }

  function handleChange(event) {
    dispatch({
      type: 'setSearchText',
      value: event.target.value,
    });
  }

  function handleClickAway(event) {
    return (
      state.opened &&
      (!suggestionsNode.current || !suggestionsNode.current.contains(event.target)) &&
      hideSearch()
    );
  }

  function navigateToAddCustomForm(event) {
    event.stopPropagation()
    event.preventDefault()
    console.log("Hello")
    hideSearch();
    dispatch({ type: 'setNoSuggestions' })
  }

  const autosuggestProps = {
    renderInputComponent,
    highlightFirstSuggestion: true,
    suggestions: state.suggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    onSuggestionSelected: handleSuggestionSelected,
    getSuggestionValue,
    renderSuggestion,
  };

  switch (props.variant) {
    case 'basic': {
      return (
        <div className={clsx('flex items-center w-full', props.className)} ref={popperNode}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              variant: props.variant,
              placeholder: props.placeholder,
              value: state.searchText,
              onChange: handleChange,
              onFocus: showSearch,
              InputLabelProps: {
                shrink: true,
              },
              autoFocus: false,
            }}
            theme={{
              container: 'flex flex-1 w-full',
              suggestionsList: 'ItemsSearchConfig-suggestionsList',
              suggestion: 'ItemsSearchConfig-suggestion',
            }}
            renderSuggestionsContainer={(options) => (
              <Popper
                anchorEl={popperNode.current}
                open={Boolean(options.children) || state.noSuggestions}
                popperOptions={{ positionFixed: true }}
                className="z-9999"
              >
                <div ref={suggestionsNode}>
                  <Paper
                    className="shadow-lg rounded-8 overflow-hidden"
                    {...options.containerProps}
                    style={{ width: popperNode.current ? popperNode.current.clientWidth : null }}
                  >
                    {options.children}
                    {state.noSuggestions && (
                      <Typography className="px-16 py-12">{props.noResults}</Typography>
                    )}
                  </Paper>
                </div>
              </Popper>
            )}
          />
        </div>
      );
    }
    case 'full': {
      return (
        <Root className={clsx('flex', props.className)}>
          <Tooltip title="Click to search" placement="bottom">
            <div
              onClick={showSearch}
              onKeyDown={showSearch}
              role="button"
              tabIndex={0}
              ref={buttonNode}
            >
              {props.trigger}
            </div>
          </Tooltip>

          {state.opened && (
            <ClickAwayListener onClickAway={handleClickAway}>
              <Paper className="absolute left-0 right-0 top-0 h-96 z-9999 shadow-0" square>
                <div className="flex items-center w-full h-full" ref={popperNode}>
                  <Autosuggest
                    {...autosuggestProps}
                    inputProps={{
                      placeholder: props.placeholder,
                      value: state.searchText,
                      onChange: handleChange,
                      InputLabelProps: {
                        shrink: true,
                      },
                      autoFocus: true,
                    }}
                    theme={{
                      container: 'flex flex-1 w-full',
                      suggestionsList: 'ItemsSearchConfig-suggestionsList',
                      suggestion: 'ItemsSearchConfig-suggestion',
                    }}
                    renderSuggestionsContainer={(options) => (
                      <Popper
                        anchorEl={popperNode.current}
                        open={Boolean(options.children) || state.noSuggestions}
                        popperOptions={{ positionFixed: true }}
                        className="z-9999"
                      >
                        <div ref={suggestionsNode}>
                          <Paper
                            className="shadow-lg"
                            square
                            {...options.containerProps}
                            style={{
                              width: popperNode.current ? popperNode.current.clientWidth : null,
                            }}
                          >
                            {options.children}
                            {state.noSuggestions && (
                              <Button
                                className=""
                                variant="contained"
                                color="secondary"
                                startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                                onClick={navigateToAddCustomForm}
                              >
                                Add To Master
                              </Button>
                            )}
                          </Paper>
                        </div>
                      </Popper>
                    )}
                  />
                  <IconButton onClick={hideSearch} className="mx-8" size="large">
                    <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                  </IconButton>
                </div>
              </Paper>
            </ClickAwayListener>
          )}
        </Root>
      );
    }
    default: {
      return null;
    }
  }
}

ItemsSearchConfig.propTypes = {};
ItemsSearchConfig.defaultProps = {
  navigation: [],
  trigger: (
    <Button
      className=""
      variant="contained"
      color="secondary"
      startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
    >
      Add
    </Button>
  ),
  variant: 'full',
  placeholder: 'Search Items to Add...',
  noResults: 'No results..',
};

export default withRouter(memo(ItemsSearchConfig));
