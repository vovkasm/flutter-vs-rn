import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  Dialog,
  FAB,
  List,
  PaperProvider,
  Portal,
  TextInput,
} from 'react-native-paper';

const Main = () => {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
};

const App = () => {
  const model = useModel();

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Todo List" />
      </Appbar.Header>
      <TodoList model={model} />
      <FAB icon="plus" style={styles.fab} onPress={model.addItem} />
      {model.isDialogVisible ? (
        <Portal>
          <Dialog
            visible={model.isDialogVisible}
            onDismiss={model.cancelDialog}>
            <Dialog.Title>Add a new todo item</Dialog.Title>
            <Dialog.Content>
              <TextInput
                defaultValue={model.dialogInputValue}
                onChangeText={value => {
                  model.setDialogInputValue(value);
                }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={model.saveAndCloseDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      ) : null}
    </>
  );
};

const TodoList = ({model}: {model: Model}) => {
  return (
    <ScrollView>
      {model.todos.map((item, i) => (
        <TodoItem key={`key-${i}`} model={model} index={i} />
      ))}
    </ScrollView>
  );
};

const TodoItem = ({model, index}: {model: Model; index: number}) => {
  const item = model.todos[index];
  return (
    <List.Item
      title={item.name}
      titleStyle={item.checked ? styles.checkedText : undefined}
      onPress={() => {
        model.checkItem(index);
      }}
    />
  );
};

type Model = ReturnType<typeof useModel>;

function useModel() {
  const [todos, setTodos] = React.useState<Todo[]>([
    {name: 'Item 1', checked: false},
    {name: 'Item 2', checked: true},
    {name: 'Item 3', checked: false},
  ]);
  const checkItem = (idx: number) => {
    todos[idx] = {...todos[idx], checked: !todos[idx].checked};
    setTodos([...todos]);
  };

  const [isDialogVisible, setDialogVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const addItem = () => {
    setDialogVisible(true);
  };
  const cancelDialog = () => {
    setDialogVisible(false);
  };
  const saveAndCloseDialog = () => {
    setTodos([...todos, {name: inputValue, checked: false}]);
    setInputValue('');
    cancelDialog();
  };

  return {
    todos,
    checkItem,
    addItem,

    isDialogVisible,
    cancelDialog,
    saveAndCloseDialog,

    dialogInputValue: inputValue,
    setDialogInputValue: setInputValue,
  };
}

type Todo = {
  name: string;
  checked: boolean;
};

export default Main;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
  },
  checkedText: {
    textDecorationLine: 'line-through',
  },
});
