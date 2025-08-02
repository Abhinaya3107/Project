
<<<<<<< HEAD
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Vendor;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

	Optional<Vendor> findById(Long id);

	boolean existsByEmail(String email);

	Optional<Vendor> findByEmailAndPassword(String email, String password);

	// These are already in your code:
	List<Vendor> findByCategory(String category);
	List<Vendor> findByEventId(Long eventId);
}
=======
>>>>>>> org3
