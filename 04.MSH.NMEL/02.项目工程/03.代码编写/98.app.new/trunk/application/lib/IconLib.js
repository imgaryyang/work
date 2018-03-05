
import Entypo           from 'react-native-vector-icons/Entypo';
import EvilIcons        from 'react-native-vector-icons/EvilIcons';
import FontAwesome      from 'react-native-vector-icons/FontAwesome';
import Foundation       from 'react-native-vector-icons/Foundation';
import Ionicons         from 'react-native-vector-icons/Ionicons';
import MaterialIcons    from 'react-native-vector-icons/MaterialIcons';
import Octicons         from 'react-native-vector-icons/Octicons';
import Zocial           from 'react-native-vector-icons/Zocial';

const iconLib = {
    Entypo:         Entypo,
    EvilIcons:      EvilIcons,
    FontAwesome:    FontAwesome,
    Foundation:     Foundation,
    Ionicons:       Ionicons,
    MaterialIcons:  MaterialIcons,
    Octicons:       Octicons,
    Zocial:         Zocial,
};

const iconLibAlias = {
    et: Entypo,
    ei: EvilIcons,
    fa: FontAwesome,
    fd: Foundation,
    ii: Ionicons,
    mi: MaterialIcons,
    oi: Octicons,
    zi: Zocial,
};

export get (name) {
	return iconLib[name] ? 
        iconLib[name] : 
        (
            iconLibAlias[name] ? 
            iconLibAlias[name] : 
            null
        );
};

