import * as ImagePicker from 'expo-image-picker';

export const useReceiptPicker = (uris: string[], onChange: (next: string[]) => void) => {
  const add = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (result.canceled) return;
    onChange([...uris, ...result.assets.map((asset) => asset.uri)]);
  };

  const removeAt = (index: number) => onChange(uris.filter((_, i) => i !== index));

  return {add, removeAt};
};
