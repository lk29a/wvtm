package lk.thesis.wvtm.restapi;

import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.core.Application;

/**
 *
 * @author lk
 */
public class RestApplication extends Application{
    
    /**
     *
     * @return
     */
    @Override
    public Set<Class<?>> getClasses() {
        final Set<Class<?>> classes = new HashSet<>();
        return classes;
    }
}
