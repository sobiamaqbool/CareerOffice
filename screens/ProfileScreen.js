import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db, storage } from './firebase'; // adjust path if needed

export default function StudentProfileScreen() {
  const user = auth.currentUser;
  const [profileData, setProfileData] = useState({
    fullName: '',
    studentId: '',
    program: '',
    year: '',
    skills: '',
    interests: '',
    profileImage: null,
    resumeUrl: null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const MAX_IMAGE_SIZE = 100 * 1024; // 100 KB
  const MAX_RESUME_SIZE = 1 * 1024 * 1024; // 1 MB

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'students', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const uploadImageBlob = async (blob) => {
    setUploading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('No user logged in');

      const imageRef = ref(storage, `profilePictures/${uid}.jpg`);
      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);

      await setDoc(doc(db, 'students', uid), { profileImage: url }, { merge: true });
      setProfileData((prev) => ({ ...prev, profileImage: url }));
      Alert.alert('Success', 'Image uploaded and saved!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed', error.message || 'Unknown error');
    }
    setUploading(false);
  };

  const pickImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Please allow media library access.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;

        const response = await fetch(uri);
        const blob = await response.blob();

        if (blob.size > MAX_IMAGE_SIZE) {
          Alert.alert(
            'Image too large',
            `Selected image is ${(blob.size / 1024).toFixed(1)} KB. Must be under 100 KB.`
          );
          return;
        }

        await uploadImageBlob(blob);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', error.message || 'Image picking failed.');
    }
  };

  const pickResume = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const uri = file.uri;

    console.log('Selected file name:', file.name);
    console.log('File URI:', uri);

    const response = await fetch(uri);
    const blob = await response.blob();

    console.log('Blob size in bytes:', blob.size);

    if (blob.size === 0) {
      Alert.alert('Error', 'Resume file is empty or unreadable.');
      return;
    }

    if (blob.size > MAX_RESUME_SIZE) {
      Alert.alert('File too large', 'Resume must be under 1MB.');
      return;
    }

    const safeFileName = file.name.replace(/[^\w.-]/g, '_');
    const storagePath = `resumes/${user.uid}_${safeFileName}`;
    const storageRef = ref(storage, storagePath);

    console.log('Uploading to path:', storagePath);
    console.log('Blob type:', blob.type);

    setUploadingResume(true);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    await setDoc(doc(db, 'students', user.uid), { resumeUrl: url }, { merge: true });
    setProfileData(prev => ({ ...prev, resumeUrl: url }));
    Alert.alert('Success', 'Resume uploaded!');
  } catch (error) {
    console.error('Resume upload failed:', error);
    Alert.alert('Error', error.message || 'Resume upload failed.');
  }
  setUploadingResume(false);
};


  const saveProfile = async () => {
    try {
      await setDoc(doc(db, 'students', user.uid), profileData, { merge: true });
      Alert.alert('Success', 'Profile saved!');
      setEditMode(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileImageContainer}>
        {uploading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                profileData.profileImage
                  ? { uri: profileData.profileImage }
                  : require('../assets/images/avatar-placeholder.png')
              }
              style={styles.profileImage}
            />
            <Text style={styles.editText}>Edit Photo</Text>
          </TouchableOpacity>
        )}
      </View>

      {['fullName', 'studentId', 'program', 'year', 'skills', 'interests'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.replace(/([A-Z])/g, ' $1')}
          value={profileData[field]}
          onChangeText={(text) => setProfileData({ ...profileData, [field]: text })}
          editable={editMode}
        />
      ))}

      <TouchableOpacity style={styles.primaryButton} onPress={editMode ? saveProfile : () => setEditMode(true)}>
        <Text style={styles.buttonText}>{editMode ? 'Save Profile' : 'Edit Profile'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={pickResume}>
        <Text style={styles.secondaryButtonText}>
          {uploadingResume ? 'Uploading...' : 'Upload Resume (PDF)'}
        </Text>
      </TouchableOpacity>

      {profileData.resumeUrl && (
        <TouchableOpacity
          onPress={() => Linking.openURL(profileData.resumeUrl)}
          style={styles.downloadButton}
        >
          <Text style={styles.downloadButtonText}>Download Resume</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editText: {
    color: '#2F318D',
    marginTop: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#2F318D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#EEF0FB',
    borderColor: '#2F318D',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#2F318D',
    fontWeight: '600',
    fontSize: 15,
  },
  downloadButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
  },
});
